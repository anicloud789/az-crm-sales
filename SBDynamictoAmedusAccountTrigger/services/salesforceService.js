const salesforceAuth = require('../auth/salesforceAuth');
const axios = require('axios');

// Update Salesforce instance URL : process.env.SaleforceURL
const BASE_URL = 'https://dream-nosoftware-499.my.salesforce.com';

const getSalefoceAccessToken = async () => {
    const accessToken = await salesforceAuth.authenticatSFTokenRequest();
    return accessToken;
};

const getAllAccount = async () => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.get(`${BASE_URL}/services/data/v53.0/sobjects/Account`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response && response.data) {
            return response.data;
        } else {
            throw new Error('Failed to fetch account from Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to fetch account from Salesforce: ' + error.message);
    }
};

const getAccount = async (accountId) => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.get(`${BASE_URL}/services/data/v53.0/sobjects/Account/${accountId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response && response.data) {
            return response.data;
        } else {
            throw new Error('Failed to fetch account from Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to fetch account from Salesforce: ' + error.message);
    }
};

const createAccount = async (accountDetails) => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.post(`${BASE_URL}/services/data/v53.0/sobjects/Account/`, accountDetails, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response && response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error('Failed to create account in Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to create account in Salesforce: ' + error.message);
    }
};

const updateAccount = async (accountId, accountDetails) => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.patch(`${BASE_URL}/services/data/v53.0/sobjects/Account/${accountId}`, accountDetails, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response && response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error('Failed to update account in Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to update account in Salesforce: ' + error.message);
    }
};

const deleteAccount = async (accountId) => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.delete(`${BASE_URL}/services/data/v53.0/sobjects/Account/${accountId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response && response.status === 204) {
            return true; // Successful deletion
        } else {
            throw new Error('Failed to delete account from Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to delete account from Salesforce: ' + error.message);
    }
};

module.exports = {
    getAllAccount,
    getAccount,
    createAccount,
    updateAccount,
    deleteAccount
};