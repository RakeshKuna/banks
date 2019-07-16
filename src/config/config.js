//BANKS BASE URL

// const DEPLOYMENT_CRITERIA = window.RUNTIME_API_HOST ? window.RUNTIME_API_HOST : "sit";
// `integration`

// const URL = process.env.REACT_APP_BANKS;
const DEPLOYMENT_CRITERIA = "integration";

const BANKS_URL = `http://bank-onboarding-service-snap.${DEPLOYMENT_CRITERIA}.apps.ocp.uaeexchange.com`;

 export const BANKS_BASE_URL = `${BANKS_URL}/onboarding/api/v1/`;
//export const BANKS_BASE_URL = "http://bank-onboarding-service-snap.dev.apps.ocp.uaeexchange.com/api/v1/onboarding/"
const AGENTS_BASE_URL = `http://agent-onboarding-service-snap.${DEPLOYMENT_CRITERIA}.apps.ocp.uaeexchange.com`;

// ManageTransmission Base URLs
const ManageTransmission_BASE_URL = `http://manage-transmission-snap.${DEPLOYMENT_CRITERIA}.apps.ocp.uaeexchange.com/api/v1/transmission/`;

export const PAAS_LOGIN_URL = `http://paas-home-ui.${DEPLOYMENT_CRITERIA}.apps.ocp.uaeexchange.com`;

// const NEWDOMAIN_URL = 'http://agent-onboarding-service-snap.dev.apps.ocp.uaeexchange.com'

//AGENT BASE URL
export const AGENT_URL = `${AGENTS_BASE_URL}/onboarding/api/v1/`;

//ALL Banks Base URL
export const BANKS_API_BASE_URL = `${BANKS_BASE_URL}banks`;

//BANKS API URLs
export const IMPORT_BANKS = `${BANKS_API_BASE_URL}/file`
export const BANKS_LIST = `${BANKS_API_BASE_URL}`

//Branches API URLs
export const ALL_BRANCHES_URL = `${BANKS_BASE_URL}branches`
export const IMPORT_BRANCHES = `${ALL_BRANCHES_URL}/file`

//DraweeBanks API URLs
//for editing and view drawee bank use drawee bank base url
export const DRAWEE_BANK_BASE_URL = `${BANKS_BASE_URL}draweeBanks/`
export const ALL_DRAWEE_BANKS = `${DRAWEE_BANK_BASE_URL}all`
export const PRODUCT_PROFILE = "/draweeBankProductProfiles"
export const GENERAL_RULES_API_URL = `${BANKS_BASE_URL}${PRODUCT_PROFILE}`

//DraweeBankRules
export const DRAWEE_BANK_RULES_URL = `${BANKS_BASE_URL}draweeBankProductProfiles/`

export const ACCOUNTVALIDATION_API_BASE_URL = `${BANKS_BASE_URL}accountNumberValidations`;
//Master data API URLS
export const MASTER_DATA_BASE_URL = `${BANKS_BASE_URL}`
export const MASTER_DATA_DRAWEE_BANKS = `${MASTER_DATA_BASE_URL}draweeBanks`
export const PROFILE_DRAEWEE_BANKS = `${MASTER_DATA_DRAWEE_BANKS}/profile`
export const FIELD_VALIDATION = "drawee-rules/field-validation-rules"
export const FIELD_RULES = "/field-validation-rules"
export const GENERAL_RULES = "drawee-rules/general-rules"
export const CURRENCY_URL = `${MASTER_DATA_BASE_URL}currencies`
export const PRODUCT_TYPE_URL = `${MASTER_DATA_BASE_URL}/productTypes`
export const SERVICE_PROVIDER_URL = `${MASTER_DATA_BASE_URL}serviceproviders`
export const COUNTRY_URL = `${MASTER_DATA_BASE_URL}countries`
export const AGENT_PROFILE_URL = `${AGENT_URL}agents?agentContainsBranches=true`
// http://localhost:8080/agents/api/v0.1/agents?agentContainsBranches=true
export const SOURCE_OF_INCOME = `${MASTER_DATA_BASE_URL}incomeSources`



//Nationality Restrictions API URLS FOR edit and create and get 
export const DRAWEE_BANK_PRODUCT_PROFILE = "draweebank/productprofile/"
export const NATIONALITY_RESTRICTION_BASE_URL = `${BANKS_BASE_URL}${DRAWEE_BANK_PRODUCT_PROFILE}`

export const buildViewBranchURL = (branchId) => {
    return `${ALL_BRANCHES_URL}/${branchId}`
}

export const buildViewBankURL = (bankId) => {
    return `${BANKS_API_BASE_URL}/${bankId}`
}

export const buildFetchBranchesListURL = (bankId) => {
    return `${BANKS_API_BASE_URL}/${bankId}/branches`
}

export const buildCreateDraweeBankBranchURL = (draweeBankId) => {
    return `${DRAWEE_BANK_BASE_URL}${draweeBankId}${PRODUCT_PROFILE}`
}

export const buildEditOrFetchDraweeBankBranchProfileURL = (draweeBankId, draweeBankBranchId) => {
    return `${DRAWEE_BANK_BASE_URL}${draweeBankId}${PRODUCT_PROFILE}/${draweeBankBranchId}`
}

export const buildFetchDraweeBankBranchListURL = (draweeBankId) => {
    return `${DRAWEE_BANK_BASE_URL}${draweeBankId}/${PRODUCT_PROFILE}`
}

export const buildGeneralRulesAPI = (draweeBankId) => {
    return `${GENERAL_RULES_API_URL}/${draweeBankId}/${GENERAL_RULES}`
}

export const buildFieldValidationRulesAPI = (branchId) => {
    return `${GENERAL_RULES_API_URL}/${branchId}/${FIELD_VALIDATION}`
}

export const buildDraweeBank = (bankcode) => {
    return `${DRAWEE_BANK_BASE_URL}${bankcode}`
}

export const buildEditOrFetchDraweeBank = (draweeBankId) => {
    return `${DRAWEE_BANK_BASE_URL}${draweeBankId}`
}

//nationality restrictions for get profile

export const buildNationalityList = (draweeBankId) => {
    return `${NATIONALITY_RESTRICTION_BASE_URL}/${draweeBankId}/nationalityRestrictions`
}
export const createNationalityProfile = (draweeBankId) => {
    return `${NATIONALITY_RESTRICTION_BASE_URL}/${draweeBankId}/nationalityRestrictions`
}
export const editNationalityProfile = (draweeBankId, draweeRulesId) => {
    return `${NATIONALITY_RESTRICTION_BASE_URL}/${draweeBankId}/nationalityRestrictions/${draweeRulesId}`
}

export const buildBranchIdentification = (branchId) => {
    return `${ALL_BRANCHES_URL}/${branchId}/branchIdentificationCodes`
}

export const buildFetchCountryRestrictions = (draweeProfileId) => {
    return `${BANKS_BASE_URL}draweebank/productprofile/${draweeProfileId}/countryRestrictions`
}

export const buildFetchCountryRestrictionDetails = (draweeProfileId, ruleId) => {
    return `${BANKS_BASE_URL}draweebank/productprofile/${draweeProfileId}/countryRestrictions/${ruleId}`
}


export const buildFetchAgents = (countryCode) => {
    // return `${NEWDOMAIN_URL}/agents/api/v0.1/agents/${agentId}`
    return `${AGENT_URL}agents?countryCode=${countryCode}`
}

export const buildFetchAgentBranches = (agentId) => {
    return `${AGENTS_BASE_URL}/onboarding/api/v1/agent/${agentId}/branches`
}

export const buildCreateCountryRestriction = (draweeProductId) => {
    return `${BANKS_BASE_URL}draweebank/productprofile/${draweeProductId}/countryRestrictions`
}

export const buildFetchBeneficiaryBanks = (draweeProductId) => {
    return `${BANKS_BASE_URL}draweebank/productprofile/${draweeProductId}/beneficiaryMapping`
}

export const buildEditBeneficiaryBanks = (draweeProductId, ruleId) => {
    return `${BANKS_BASE_URL}draweebank/productprofile/${draweeProductId}/beneficiaryMapping/${ruleId}`
}


//SourceOfFunds

export const buildSourceOfFunds = (draweeProductId) => {
    return `${BANKS_BASE_URL}${draweeProductId}/sourceOfFundsRule`
}

export const fetchSourceOfIncomes = (draweeProductId) => {
    return `${BANKS_BASE_URL}${draweeProductId}/sourceOfFundsRules`
}

export const buildUpdateSourceOfFundsFieldsCodeValue = (draweeProfileId, id) => {
    return `${BANKS_BASE_URL}${draweeProfileId}/sourceOfFundsRules/${id}/draweeBankProductProfileSourceOfFundsCode`
}

export const buildUpdateSourceOfFundsFieldsMaxAmount = (draweeProfileId, id) => {
    return `${BANKS_BASE_URL}${draweeProfileId}/sourceOfFundsRules/${id}/maximumAmount`
}

export const buildUpdateSourceOfFundsStatus = (draweeProfileId, id) => {
    return `${BANKS_BASE_URL}${draweeProfileId}/sourceOfFundsRules/${id}/status`
}

// Drawee Bank 4 Rate API URLS

export const buildListDraweeBank4Rate = (draweeProductId) => {
    return `${BANKS_BASE_URL}draweeBankProductProfiles/${draweeProductId}/draweeBank4Rate`
}

export const buildCreateDraweeBank4Rate = (draweeProductId) => {
    return `${BANKS_BASE_URL}draweeBankProductProfiles/${draweeProductId}/draweeBank4Rate`
}

export const buildEditDraweeBank4RateStatus = (draweeBankProductProfileId , draweeBankForRateId ) => {
    return `${BANKS_BASE_URL}draweeBankProductProfiles/${draweeBankProductProfileId }/draweeBank4Rate/${draweeBankForRateId }`
}

// Agent Drawee bank 4 Rate

export const AGENT_BRANCH_PROFILE_URL = (agentId) => {
    return `${AGENT_URL}agent/${agentId}/branches`
}

export const buildCreateAgentDraweeBank4Rate = (draweeProductId) => {
    return `${BANKS_BASE_URL}draweeBankProductProfiles/${draweeProductId}/agentDraweeBank4Rates`
}

export const buildListAgentDraweeBank4Rate = (draweeProductId) => {
    return `${BANKS_BASE_URL}draweeBankProductProfiles/${draweeProductId}/agentDraweeBank4Rates`
}

export const buildEditAgentDraweeBank4Rate = (draweeBankProductProfileId , agentDraweeBankForRateId  ) => {
    return `${BANKS_BASE_URL}draweeBankProductProfiles/${draweeBankProductProfileId }/agentDraweeBank4Rates/${agentDraweeBankForRateId}`
}


//AccountValidations API URLS

export const buildFetchDraweeBankList = () => {
    return `${DRAWEE_BANK_BASE_URL}draweeBankProductProfiles`

}

export const buildFetchBeneficiaryBanksList = () => {
    return `${BANKS_BASE_URL}draweebank/productprofile/beneficiaryMappings`
}



//Manage Transmissions API URLS 
export const buildFetchgetManageTransmissions = (draweeProductId) => {
    return `${ManageTransmission_BASE_URL}draweebank/productprofile/${draweeProductId}/manageTransmissions`
}

export const buildcreateManageTransmissions = (draweeProductId) => {
    return `${ManageTransmission_BASE_URL}draweebank/productprofile/${draweeProductId}/manageTransmissions`

}

export const buildEditManageTransmissions = (draweeProductId,manageTransmissionId) => {
    return `${ManageTransmission_BASE_URL}draweebank/productprofile/${draweeProductId}/manageTransmissions/${manageTransmissionId}`
}

export const buildFetchgetManageTransmissionsDetails = (draweeProfileId, ruleId) => {
    return `${ManageTransmission_BASE_URL}draweebank/productprofile/${draweeProfileId}/manageTransmissions/${ruleId}`
}


// Purpose of transaction API URLs
export const buildFetchCategoryTypes = () => {
    return `${BANKS_BASE_URL}purposeCodeCategories`
}

export const buildFetchPurposeTypes = (categoryId) => {
    return `${BANKS_BASE_URL}purposeCodes/${categoryId}`
}

export const buildFetchPurposeList = (draweeProfileId) => {
    return `${BANKS_BASE_URL}draweebankProductProfiles/${draweeProfileId}/purposeCodes`
}

export const buildUpdatePurposeFieldsCodeValue = (draweeProfileId, id) => {
    return `${BANKS_BASE_URL}draweebankProductProfiles/${draweeProfileId}/purposeCodes/${id}/codeValue`
}

export const buildUpdatePurposeFieldsMaxAmount = (draweeProfileId, id) => {
    return `${BANKS_BASE_URL}draweebankProductProfiles/${draweeProfileId}/purposeCodes/${id}/maxAmount`
}

export const buildUpdatePurposeFieldsStatus = (draweeProfileId, id) => {
    return `${BANKS_BASE_URL}draweebankProductProfiles/${draweeProfileId}/purposeCodes/${id}/status`
}

// Account Validations API URLs
export const buildCreateAccountValidation = () => {
    return `${BANKS_BASE_URL}accountNumberValidations`
}

export const buildViewAccountValidationURL = (accountNumberValidationId) => {
    return `${ACCOUNTVALIDATION_API_BASE_URL}/${accountNumberValidationId}`
}

export const EditViewAccountValidationURL = (accountNumberValidationId) => {
    return `${ACCOUNTVALIDATION_API_BASE_URL}/${accountNumberValidationId}`
}

export const PAAS_DASHBOARD_URL = `${PAAS_LOGIN_URL}/dash-board`;
