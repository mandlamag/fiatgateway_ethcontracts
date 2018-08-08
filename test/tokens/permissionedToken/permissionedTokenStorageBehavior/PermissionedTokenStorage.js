const { ZERO_ADDRESS, expectRevert, expectThrow } = require('../../../helpers/common');
const { PermissionSheetMock, ValidatorSheetMock } = require('../../../helpers/mocks');
const { Regulator, PermissionedTokenStorage } = require('../../../helpers/artifacts');

function permissionedTokenStorageTests(owner, tokenHolder, spender, user) {

    describe('PermissionedTokenStorage behavior tests', function () {
        const from = owner
        beforeEach(async function () {
            await this.allowanceSheet.addAllowance(tokenHolder, spender, 100 * 10 ** 18, { from })
            await this.balanceSheet.addBalance(user, 100 * 10 ** 18, { from: owner })
        })
        describe("constructor tests", function () {
            beforeEach(async function() {
                let validator = spender
                this.permissionSheet = await PermissionSheetMock.new({ from: owner })
                this.validatorSheet = await ValidatorSheetMock.new(validator, { from: owner })
                this.regulator = await Regulator.new(this.permissionSheet.address, this.validatorSheet.address, { from: owner })
            })
            describe("regulator provided is not a valid contract address", function () {
                it("call reverts", async function () {
                    await expectRevert(PermissionedTokenStorage.new(
                        ZERO_ADDRESS,
                        this.balanceSheet.address,
                        this.allowanceSheet.address, { from: owner }));
                })
            })
            describe("balance sheet provided is not a valid contract address", function () {
                it("call reverts", async function () {
                    await expectRevert(PermissionedTokenStorage.new(
                        this.regulator.address,
                        ZERO_ADDRESS,
                        this.allowanceSheet.address, { from: owner }));
                })
            })
            describe("allowance sheet provided is not a valid contract address", function () {
                it("call reverts", async function () {
                    await expectRevert(PermissionedTokenStorage.new(
                        this.regulator.address,
                        this.balanceSheet.address,
                        ZERO_ADDRESS, { from: owner }));
                })
            })
        })
        describe('Allowances CRUD tests', function () {
            describe('owner calls', function () {
                const from = owner
                it('addAllowance', async function () {
                    await this.allowanceSheet.addAllowance(tokenHolder, spender, 70 * 10 ** 18, { from })
                    const balance = await this.allowanceSheet.allowanceOf(tokenHolder, spender)
                    assert.equal(balance, (100 + 70) * 10 ** 18)
                })

                it('subAllowance', async function () {
                    await this.allowanceSheet.subAllowance(tokenHolder, spender, 70 * 10 ** 18, { from })
                    const balance = await this.allowanceSheet.allowanceOf(tokenHolder, spender)
                    assert.equal(balance, (100 - 70) * 10 ** 18)
                })

                it('setAllowance', async function () {
                    await this.allowanceSheet.setAllowance(tokenHolder, spender, 70 * 10 ** 18, { from })
                    const balance = await this.allowanceSheet.allowanceOf(tokenHolder, spender)
                    assert.equal(balance, 70 * 10 ** 18)
                })

                it('reverts subAllowance if insufficient funds', async function () {
                    await expectThrow(this.allowanceSheet.subAllowance(tokenHolder, spender, 170 * 10 ** 18, { from }))
                })
            })

            describe('non-owner calls', function () {
                const from = tokenHolder
                it('reverts all calls', async function () {
                    await expectRevert(this.allowanceSheet.addAllowance(tokenHolder, spender, 70 * 10 ** 18, { from }))
                    await expectRevert(this.allowanceSheet.subAllowance(tokenHolder, spender, 70 * 10 ** 18, { from }))
                    await expectRevert(this.allowanceSheet.setAllowance(tokenHolder, spender, 70 * 10 ** 18, { from }))
                })
            })
        })
        describe('Balances CRUD tests', function () {
            describe('owner calls', function () {
                const from = owner
                it('addBalance', async function () {
                    await this.balanceSheet.addBalance(user, 70 * 10 ** 18, { from })
                    const balance = await this.balanceSheet.balanceOf(user)
                    assert.equal(balance, (100 + 70) * 10 ** 18)
                })
                it('subBalance', async function () {
                    await this.balanceSheet.subBalance(user, 70 * 10 ** 18, { from })
                    const balance = await this.balanceSheet.balanceOf(user)
                    assert.equal(balance, (100 - 70) * 10 ** 18)
                })
                it('setBalance', async function () {
                    await this.balanceSheet.setBalance(user, 70 * 10 ** 18, { from })
                    const balance = await this.balanceSheet.balanceOf(user)
                    assert.equal(balance, 70 * 10 ** 18)
                })
                it('reverts subBalance if insufficient funds', async function () {
                    await expectThrow(this.balanceSheet.subBalance(user, 170 * 10 ** 18, { from }))
                })
            })
            describe('non-owner calls', function () {
                const from = tokenHolder
                it('reverts all calls', async function () {
                    await expectRevert(this.balanceSheet.addBalance(user, 70 * 10 ** 18, { from }))
                    await expectRevert(this.balanceSheet.subBalance(user, 70 * 10 ** 18, { from }))
                    await expectRevert(this.balanceSheet.setBalance(user, 70 * 10 ** 18, { from }))
                })
            })
        })
    })
}

module.exports = {
    permissionedTokenStorageTests
}