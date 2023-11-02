const axios = require('axios');
const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

const keyVault_Name = process.env.KeyVaultName
const keyVault_URL = `https://${keyVault_Name}.vault.azure.net/`;
const keyVaultCLient = new SecretClient(keyVault_URL, new DefaultAzureCredential());
const salesforceConfig = {
    refreshToken: '5Aep861sDdjizbO.v67LqnYf.ft9iRXFahTWmFnFE51_rEreGDFEfhUW25TKGNOSuGDq4e7jLcMOVcZaZLU3YRW', // process.env.SF_CLIENT_REFRESH_TOKEN
    accessToken: '',
    tokenExpiration: 0,
    instanceUrl: process.env.SaleforceBaseInstanceUrl
};

const authenticatSFTokenRequest = async () => {
    try {
        const kVSalesClientID = await keyVaultCLient.getSecret('kv-sales-client-id');
        const kVSalesClientSecret = await keyVaultCLient.getSecret('kv-sales-client-secret');
        const kVSalesClientRefreshToken = await keyVaultCLient.getSecret('kv-sales-client-refreshToken');
        const response = await axios.post(`${salesforceConfig.instanceUrl}/services/oauth2/token`, null, {
            params: {
                grant_type: 'refresh_token',
                client_id: kVSalesClientID.value,
                client_secret: kVSalesClientSecret.value,
                refresh_token: kVSalesClientRefreshToken.value,
            },
        });

        if (response.data && response.data.access_token) {
            return response.data.access_token;
        } else {
            throw new Error('Failed to authenticate with Salesforce.');
        }
    } catch (error) {
        throw new Error('Salesforce authentication failed: ' + error.message);
    }
};

module.exports = {
    authenticatSFTokenRequest
};



