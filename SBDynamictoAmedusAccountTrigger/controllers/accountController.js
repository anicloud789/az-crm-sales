const salesforceService = require('../services/salesforceService');
const { logger, generateCorrelationId } = require('../logger/winstonLogger');


module.exports = async function (context, req) {
    const correlationId = generateCorrelationId();
    //context.log("S_correlationid=>", correlationId);
    logger.log({ level: 'info', message: 'Account Funcation call Started', correlationId, });
    await accountController(context, req, correlationId);
    logger.log({ level: 'info', message: 'Account Funcation call Endded ', correlationId, });
};

async function accountController(context, req, correlationId) {
    try {
        const isDebugMode = process.env.NODE_ENV === 'development' && process.env.DEBUG_MODE === 'true';
        if (isDebugMode) {
            context.log("ENV=>", process.env.NODE_ENV);
            context.log("DebugMode=>", process.env.DEBUG_MODE);
            context.log("data=>", JSON.stringify(req, null, 2));
        }
        logger.log({ level: 'info', message: JSON.stringify(req, null, 2), correlationId, });
        const action = req.action;
        const accountId = req.accountId;

        if (action === 'getAll') {
            const account = await salesforceService.getAllAccount();
            context.res = {
                status: 200,
                body: account.recentItems
            };

        } else if (action === 'create') {
            const accountDetails = req.data;
            const createdAccount = await salesforceService.createAccount(accountDetails);
            context.res = {
                status: 201,
                body: createdAccount
            };
        }
        else if (action === 'update') {
            const accountDetails = req.data;
            context.log("Update Account ID =>", accountId);
            context.log("Update Account Request Details=>", JSON.stringify(accountDetails, null, 2));
            const updatedAccount = await salesforceService.updateAccount(accountId, accountDetails);
            context.log("Updated Account By ID=>", JSON.stringify(updatedAccount, null, 2));
            context.res = {
                status: 200,
                body: updatedAccount
            };
        }
        else if (action === 'delete') {
            context.log("Delete Account ID =>", accountId);
            await salesforceService.deleteAccount(accountId);
            context.res = {
                status: 204
            };
        }
        else if (action === 'get') {
            logger.log({ level: 'info', message: "Get Action Started", correlationId, });
            const account = await salesforceService.getAccount(accountId);
            if (isDebugMode) {
                context.log("Get Account By ID=>", JSON.stringify(account, null, 2));
            }
            logger.log({ level: 'info', message: "Get Action Ended", correlationId, });
            context.res = {
                status: 200,
                body: account
            };
        }
        else {
            context.res = {
                status: 200,
                body: 'Invalid action specified.'
            };
            logger.log({ level: 'error', message: "Invalid action specified", correlationId, });
        }
    } catch (error) {
        if (isDebugMode) {
            context.log("Error_correlationid=>", correlationId);
        }
        logger.log({ level: 'error', message: error, correlationId, });
        context.res = {
            status: 200,
            body: "Error Found"
        };

    }

}