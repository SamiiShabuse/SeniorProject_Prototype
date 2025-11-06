import type { Control, TestRequest } from '../lib/types'

// Load normalized controls (generated from the Excel import) and map into the
// typed Control[] structure. This embeds the normalized JSON produced by
// `scripts/import_controls.cjs` so the app can start with the imported data.
// Null date fields are converted to `undefined` to satisfy the TypeScript types.
const _normalizedPayload = {
  "normalized": [
    {
      "id": "VGCP-10000",
      "name": "Procedure Name",
      "description": "DAT Status",
      "owner": "",
      "sme": "Procedure Name",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "DAT Status",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10001",
      "name": "UPDATE: The Security Risk Management Committee, consisting of senior leadership, meets periodically to report operational status, discuss risk, and set the direction for the enterprise security program.",
      "description": "Completed",
      "owner": "",
      "sme": "UPDATE: The Security Risk Management Committee, consisting of senior leadership, meets periodically to report operational status, discuss risk, and set the direction for the enterprise security program.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10002",
      "name": "Threat reports with identified vulnerabilities are distributed to stakeholders to action upon.",
      "description": "Completed",
      "owner": "",
      "sme": "Threat reports with identified vulnerabilities are distributed to stakeholders to action upon.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10003",
      "name": "Red Team Exercises are conducted to test and improve detection and prevention capabilities",
      "description": "Completed",
      "owner": "",
      "sme": "Red Team Exercises are conducted to test and improve detection and prevention capabilities",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10004",
      "name": "Purple Team Exercise are conducted to test and improve detection and prevention capabilities",
      "description": "Completed",
      "owner": "",
      "sme": "Purple Team Exercise are conducted to test and improve detection and prevention capabilities",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10005",
      "name": "Standard Operating Procedures for SIEM monitoring rules and alerts are established through a formal process.",
      "description": "Completed",
      "owner": "",
      "sme": "Standard Operating Procedures for SIEM monitoring rules and alerts are established through a formal process.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10006",
      "name": "All transactions are monitored for fraud and accounts with potential fraud are investigated (Accumulation)",
      "description": "Completed",
      "owner": "",
      "sme": "All transactions are monitored for fraud and accounts with potential fraud are investigated (Accumulation)",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10007",
      "name": "SIEM rules are recertified annually through a formal process",
      "description": "Completed",
      "owner": "",
      "sme": "SIEM rules are recertified annually through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10008",
      "name": "NEW CONTROL: The Incident Response Plan between Blackrock and Vanguard is reviewed and approved at least annualy for security handling",
      "description": "Completed",
      "owner": "",
      "sme": "NEW CONTROL: The Incident Response Plan between Blackrock and Vanguard is reviewed and approved at least annualy for security handling",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10009",
      "name": "NEW CONTROL: A BI-Annual table-top exercise (TTX) is conducted of a secuirty incident notice from Blackrock and action items are documented to adress uncovered gaps",
      "description": "Completed",
      "owner": "",
      "sme": "NEW CONTROL: A BI-Annual table-top exercise (TTX) is conducted of a secuirty incident notice from Blackrock and action items are documented to adress uncovered gaps",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10010",
      "name": "NEW CONTROL: All transactions are monitored for fraud and accounts with potential fraud are investigated (Pension)",
      "description": "Completed",
      "owner": "",
      "sme": "NEW CONTROL: All transactions are monitored for fraud and accounts with potential fraud are investigated (Pension)",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10011",
      "name": "All suspected fraudulent activity related to the Super Annuation business are documented as cases, further investigated, and elevated as necessary.",
      "description": "Completed",
      "owner": "",
      "sme": "All suspected fraudulent activity related to the Super Annuation business are documented as cases, further investigated, and elevated as necessary.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10012",
      "name": "CyberArk/ID Vault is used to authorize, limit, and record administrative access for SWIFT deployments.",
      "description": "Completed",
      "owner": "",
      "sme": "CyberArk/ID Vault is used to authorize, limit, and record administrative access for SWIFT deployments.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10013",
      "name": "The vulnerability scanning tool is monitored for availability and ability to receive updates",
      "description": "Completed",
      "owner": "",
      "sme": "The vulnerability scanning tool is monitored for availability and ability to receive updates",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10014",
      "name": "The vulnerability scanning tool scheduled to routinely scan the environment",
      "description": "Completed",
      "owner": "",
      "sme": "The vulnerability scanning tool scheduled to routinely scan the environment",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10015",
      "name": "An authentication reconciliation is conducted for the vulnerability scanning tool on a regular basis",
      "description": "Completed",
      "owner": "",
      "sme": "An authentication reconciliation is conducted for the vulnerability scanning tool on a regular basis",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10016",
      "name": "Credentials used for authenticated vulnerability scanning are protected through CyberArk.",
      "description": "Completed",
      "owner": "",
      "sme": "Credentials used for authenticated vulnerability scanning are protected through CyberArk.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10017",
      "name": "The vulnerability scanning tool scheduled to routinely scan the environment",
      "description": "Completed",
      "owner": "",
      "sme": "The vulnerability scanning tool scheduled to routinely scan the environment",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10018",
      "name": "Access requests for the Qualys application are processed by an authorized administrator upon receipt of a valid Sailpoint request",
      "description": "Completed",
      "owner": "",
      "sme": "Access requests for the Qualys application are processed by an authorized administrator upon receipt of a valid Sailpoint request",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10019",
      "name": "Critical SWIFT File Integrity Monitoring Rules are recertified annually through a documented formal process",
      "description": "Completed",
      "owner": "",
      "sme": "Critical SWIFT File Integrity Monitoring Rules are recertified annually through a documented formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10020",
      "name": "Vulnerabilities are rated for risk according to predefined criteria.",
      "description": "Completed",
      "owner": "",
      "sme": "Vulnerabilities are rated for risk according to predefined criteria.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10021",
      "name": "Information from the vulnerability scanning tool is documented and reported.",
      "description": "Completed",
      "owner": "",
      "sme": "Information from the vulnerability scanning tool is documented and reported.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10022",
      "name": "Critical SWIFT File Integrity Monitoring rules are created through a formal process",
      "description": "Completed",
      "owner": "",
      "sme": "Critical SWIFT File Integrity Monitoring rules are created through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10023",
      "name": "UPDATE: Unique RSA Tokens or YubiKeys are assigned to individual users, and users are enrolled in Okta SSO, based on access management workflow, to support multi-factor authentication",
      "description": "Completed",
      "owner": "",
      "sme": "UPDATE: Unique RSA Tokens or YubiKeys are assigned to individual users, and users are enrolled in Okta SSO, based on access management workflow, to support multi-factor authentication",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10024",
      "name": "A host reconciliation is conducted for the vulnerability scanning tool on a regular basis",
      "description": "Completed",
      "owner": "",
      "sme": "A host reconciliation is conducted for the vulnerability scanning tool on a regular basis",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10025",
      "name": "Assets excluded from vulnerability scanning are reviewed and approved through a formal process",
      "description": "Completed",
      "owner": "",
      "sme": "Assets excluded from vulnerability scanning are reviewed and approved through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10026",
      "name": "Assets excluded from vulnerability scanning are scanned semi-annually",
      "description": "Completed",
      "owner": "",
      "sme": "Assets excluded from vulnerability scanning are scanned semi-annually",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10027",
      "name": "Vulnerabilities that cannot be remediated or remediated within SLA follow a formal exception process.",
      "description": "Completed",
      "owner": "",
      "sme": "Vulnerabilities that cannot be remediated or remediated within SLA follow a formal exception process.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10028",
      "name": "Failed authentication attempts from the vulnerability scanning tool are tracked and remediated",
      "description": "Completed",
      "owner": "",
      "sme": "Failed authentication attempts from the vulnerability scanning tool are tracked and remediated",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10029",
      "name": "A Cyber Security Awareness Program is maintained by ES&F for National Cyber Security Awareness Month",
      "description": "Completed",
      "owner": "",
      "sme": "A Cyber Security Awareness Program is maintained by ES&F for National Cyber Security Awareness Month",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10030",
      "name": "Security requirements for Vanguard applications are documented and maintained to protect against malicious attacks.",
      "description": "Completed",
      "owner": "",
      "sme": "Security requirements for Vanguard applications are documented and maintained to protect against malicious attacks.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10031",
      "name": "Physical Security Officer resources, equipment and related systems are deployed as a layered construct, enterprise-wide.",
      "description": "Completed",
      "owner": "",
      "sme": "Physical Security Officer resources, equipment and related systems are deployed as a layered construct, enterprise-wide.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10032",
      "name": "A host reconciliation is conducted for the vulnerability scanning tool on a regular basis",
      "description": "Completed",
      "owner": "",
      "sme": "A host reconciliation is conducted for the vulnerability scanning tool on a regular basis",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10033",
      "name": "NEW CONTROL: SWIFT #3 Swift-specific Training (Phishing)",
      "description": "Completed",
      "owner": "",
      "sme": "NEW CONTROL: SWIFT #3 Swift-specific Training (Phishing)",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10034",
      "name": "Threat intelligence reports and follow-up reports are generated for security department heads and the CISO",
      "description": "Completed",
      "owner": "",
      "sme": "Threat intelligence reports and follow-up reports are generated for security department heads and the CISO",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10035",
      "name": "The VSPL Information Security Policy Framework is reviewed and approved on an annual basis",
      "description": "Completed",
      "owner": "",
      "sme": "The VSPL Information Security Policy Framework is reviewed and approved on an annual basis",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10036",
      "name": "Vanguard reviews annual information security attestations related to CPS 234 from Grow",
      "description": "Completed",
      "owner": "",
      "sme": "Vanguard reviews annual information security attestations related to CPS 234 from Grow",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10037",
      "name": "VIA crew are required to take annual fraud training to understand how to identify and report suspected and actual fraud events",
      "description": "Completed",
      "owner": "",
      "sme": "VIA crew are required to take annual fraud training to understand how to identify and report suspected and actual fraud events",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10038",
      "name": "NEW CONTROL: Multi-channel client notifications - Following any Change of Details or cash redemption request, multi-channel notifications are sent to the registered mobile Ph, email and web-portal secure message account advising the client of the change/redemption",
      "description": "Completed",
      "owner": "",
      "sme": "NEW CONTROL: Multi-channel client notifications - Following any Change of Details or cash redemption request, multi-channel notifications are sent to the registered mobile Ph, email and web-portal secure message account advising the client of the change/redemption",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10039",
      "name": "Qualys Application IDs as related to the SWIFT environment have their passwords rotated annually.",
      "description": "Completed",
      "owner": "",
      "sme": "Qualys Application IDs as related to the SWIFT environment have their passwords rotated annually.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10040",
      "name": "TWS Application IDs as related to the SWIFT environment have their passwords rotated annually.",
      "description": "Completed",
      "owner": "",
      "sme": "TWS Application IDs as related to the SWIFT environment have their passwords rotated annually.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10041",
      "name": "UPDATE: Threat Intelligence is ingested, analyzed, and triaged for handling based on priority and severity",
      "description": "Completed",
      "owner": "",
      "sme": "UPDATE: Threat Intelligence is ingested, analyzed, and triaged for handling based on priority and severity",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10042",
      "name": "Vanguard reviews annual information security attestations related to CPS 234 from AIA",
      "description": "Completed",
      "owner": "",
      "sme": "Vanguard reviews annual information security attestations related to CPS 234 from AIA",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10043",
      "name": "Vanguard reviews annual information security attestations related to CPS 234 from JP Morgan",
      "description": "Completed",
      "owner": "",
      "sme": "Vanguard reviews annual information security attestations related to CPS 234 from JP Morgan",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10044",
      "name": "An Asset Vulnerability Test (AVT) is conducted for the SWS-SwiftNet Application annually",
      "description": "Completed",
      "owner": "",
      "sme": "An Asset Vulnerability Test (AVT) is conducted for the SWS-SwiftNet Application annually",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10045",
      "name": "Ineffective information security controls are evaluated as potential material weaknesses and results are reported to the OST for notification as needed",
      "description": "Completed",
      "owner": "",
      "sme": "Ineffective information security controls are evaluated as potential material weaknesses and results are reported to the OST for notification as needed",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10046",
      "name": "VSPL Fraud Risk Assessment Profile Is reviewed and approved annually",
      "description": "Completed",
      "owner": "",
      "sme": "VSPL Fraud Risk Assessment Profile Is reviewed and approved annually",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10047",
      "name": "Simulated phishing e-mails are sent to all crew for security awareness training.",
      "description": "Completed",
      "owner": "",
      "sme": "Simulated phishing e-mails are sent to all crew for security awareness training.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10048",
      "name": "Out-of-sync ID Vault passwords for Individual privileged accounts are reconciled with source systems to support continued CyberArk use for MFA and password rotation.",
      "description": "Completed",
      "owner": "",
      "sme": "Out-of-sync ID Vault passwords for Individual privileged accounts are reconciled with source systems to support continued CyberArk use for MFA and password rotation.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10049",
      "name": "SWIFT LSO and RSO accounts are each protected in CyberArk and have separate safes and AD groups to ensure separation of duties.",
      "description": "Completed",
      "owner": "",
      "sme": "SWIFT LSO and RSO accounts are each protected in CyberArk and have separate safes and AD groups to ensure separation of duties.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10050",
      "name": "SSH Keys",
      "description": "Completed",
      "owner": "",
      "sme": "SSH Keys",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10051",
      "name": "Individual OS privileged account users must use two-factor authentication to obtain their secure OS password, which is stored and rotated in ID Vault.",
      "description": "Completed",
      "owner": "",
      "sme": "Individual OS privileged account users must use two-factor authentication to obtain their secure OS password, which is stored and rotated in ID Vault.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10052",
      "name": "Monthly quality control checks are performed between SWIFT privileged accounts and ID Vault to ensure all privileged accounts are in ID Vault. Discrepancies are researched and remediated by the ID Vault Team.",
      "description": "Completed",
      "owner": "",
      "sme": "Monthly quality control checks are performed between SWIFT privileged accounts and ID Vault to ensure all privileged accounts are in ID Vault. Discrepancies are researched and remediated by the ID Vault Team.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10053",
      "name": "Shared account session usage conducted on SWIFT servers are protected by a cryptographic protocol.",
      "description": "Completed",
      "owner": "",
      "sme": "Shared account session usage conducted on SWIFT servers are protected by a cryptographic protocol.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10054",
      "name": "NEW CONTROL: Fraud operations resourcing conducted by appropriately skilled and experienced personnel, independent of operational business units",
      "description": "Completed",
      "owner": "",
      "sme": "NEW CONTROL: Fraud operations resourcing conducted by appropriately skilled and experienced personnel, independent of operational business units",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10055",
      "name": "Annual Review of the Fraud Risk Management Policy Framework",
      "description": "Completed",
      "owner": "",
      "sme": "Annual Review of the Fraud Risk Management Policy Framework",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10056",
      "name": "Fraud awareness material and reporting mechanisms are published on Vanguard’s public website to enable members to identify and report incidences of suspected fraud.",
      "description": "Completed",
      "owner": "",
      "sme": "Fraud awareness material and reporting mechanisms are published on Vanguard’s public website to enable members to identify and report incidences of suspected fraud.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10057",
      "name": "Critical SWIFT File Integrity Monitoring rules are created through a formal process",
      "description": "Completed",
      "owner": "",
      "sme": "Critical SWIFT File Integrity Monitoring rules are created through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10058",
      "name": "NEW CONTROL: Information from the cloud vulnerability scanning tool is documented and reported.",
      "description": "Completed",
      "owner": "",
      "sme": "NEW CONTROL: Information from the cloud vulnerability scanning tool is documented and reported.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10059",
      "name": "SWIFT: Cloud vulnerability Issues are rated for risk according to predefined criteria.",
      "description": "Completed",
      "owner": "",
      "sme": "SWIFT: Cloud vulnerability Issues are rated for risk according to predefined criteria.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10060",
      "name": "SWIFT: Cloud vulnerability Findings are rated for risk according to predefined criteria.",
      "description": "Completed",
      "owner": "",
      "sme": "SWIFT: Cloud vulnerability Findings are rated for risk according to predefined criteria.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10061",
      "name": "SWIFT: Cloud vulnerabilities that cannot be remediated or remediated within SLA follow a formal exception process",
      "description": "Completed",
      "owner": "",
      "sme": "SWIFT: Cloud vulnerabilities that cannot be remediated or remediated within SLA follow a formal exception process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10062",
      "name": "Critical File Integrity Monitoring rules for cloud SWIFT applications are created through a formal process",
      "description": "Completed",
      "owner": "",
      "sme": "Critical File Integrity Monitoring rules for cloud SWIFT applications are created through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10063",
      "name": "Critical File Integrity Monitoring rules for cloud SWIFT applications are recertified annually through a documented formal process",
      "description": "In Progress",
      "owner": "",
      "sme": "Critical File Integrity Monitoring rules for cloud SWIFT applications are recertified annually through a documented formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Progress",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10064",
      "name": "NEW CONTROL: Scans are monitored and acted upon if running >72 hours (SAEP)",
      "description": "Completed",
      "owner": "",
      "sme": "NEW CONTROL: Scans are monitored and acted upon if running >72 hours (SAEP)",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10065",
      "name": "NEW CONTROL: The Wiz System Health dashboard monitors system health for Swift (SAEP)",
      "description": "Completed",
      "owner": "",
      "sme": "NEW CONTROL: The Wiz System Health dashboard monitors system health for Swift (SAEP)",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10066",
      "name": "Multifactor Authentication is enforced for logging into Australian Vanguard portal",
      "description": "Completed",
      "owner": "",
      "sme": "Multifactor Authentication is enforced for logging into Australian Vanguard portal",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10067",
      "name": "An electronic Identity Verification (IDV) check is conducted as part of the Know Your Customer (KYC)/Anti-Money laundering (AML) onboarding of Direct Investor accounts and for Superannuation account consolidation.",
      "description": "Completed",
      "owner": "",
      "sme": "An electronic Identity Verification (IDV) check is conducted as part of the Know Your Customer (KYC)/Anti-Money laundering (AML) onboarding of Direct Investor accounts and for Superannuation account consolidation.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10068",
      "name": "OKTA automatic account lookout is enforced for both invalid Multifactor Authentication (MFA) attempts and password attempts.",
      "description": "Completed",
      "owner": "",
      "sme": "OKTA automatic account lookout is enforced for both invalid Multifactor Authentication (MFA) attempts and password attempts.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10069",
      "name": "Every 2 years a table-top exercise (TTX) is conducted of a scenario-based security event within the SWIFT network and action items are documented to address uncovered gaps.",
      "description": "Completed",
      "owner": "",
      "sme": "Every 2 years a table-top exercise (TTX) is conducted of a scenario-based security event within the SWIFT network and action items are documented to address uncovered gaps.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10070",
      "name": "Enterprise Security & Fraud generates role descriptions in compliance with established HR processes.",
      "description": "Completed",
      "owner": "",
      "sme": "Enterprise Security & Fraud generates role descriptions in compliance with established HR processes.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10071",
      "name": "NDA and SLAs are documented and established within the service agreement between Vanguard and BlackRock",
      "description": "Completed",
      "owner": "",
      "sme": "NDA and SLAs are documented and established within the service agreement between Vanguard and BlackRock",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10072",
      "name": "The annual risk acceptance of BlackRock’s usage of Vanguard’s BIC is conducted",
      "description": "Completed",
      "owner": "",
      "sme": "The annual risk acceptance of BlackRock’s usage of Vanguard’s BIC is conducted",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10073",
      "name": "Antimalware software protections are optimally configured",
      "description": "Completed",
      "owner": "",
      "sme": "Antimalware software protections are optimally configured",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10074",
      "name": "Firewall Rule Requests are reviewed and approved",
      "description": "Completed",
      "owner": "",
      "sme": "Firewall Rule Requests are reviewed and approved",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10075",
      "name": "An end-to-end comprehensive firewall rule review is conducted on an annual basis for SWIFT secure zone perimeter firewalls.",
      "description": "Completed",
      "owner": "",
      "sme": "An end-to-end comprehensive firewall rule review is conducted on an annual basis for SWIFT secure zone perimeter firewalls.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10076",
      "name": "The Information Security Incident Response Team (ISIRT) Plan is reviewed and approved at least annually for security incident handling",
      "description": "Completed",
      "owner": "",
      "sme": "The Information Security Incident Response Team (ISIRT) Plan is reviewed and approved at least annually for security incident handling",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10077",
      "name": "New hires are assigned security training within 60 days.",
      "description": "Completed",
      "owner": "",
      "sme": "New hires are assigned security training within 60 days.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10078",
      "name": "Targeted role groups get consistent and needed training.",
      "description": "Completed",
      "owner": "",
      "sme": "Targeted role groups get consistent and needed training.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10079",
      "name": "An Identity and Access Management Policy applies security principles of need-to-know, least privilege, and separation of duties.",
      "description": "Completed",
      "owner": "",
      "sme": "An Identity and Access Management Policy applies security principles of need-to-know, least privilege, and separation of duties.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10080",
      "name": "A Vulnerability Management Policy is reviewed and approved annually to define vulnerability management requirements.",
      "description": "Not Started",
      "owner": "",
      "sme": "A Vulnerability Management Policy is reviewed and approved annually to define vulnerability management requirements.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Not Started",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10081",
      "name": "SWIFT Application IDs have their passwords rotated annually",
      "description": "Completed",
      "owner": "",
      "sme": "SWIFT Application IDs have their passwords rotated annually",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10082",
      "name": "Information Destruction Policy review and approval",
      "description": "Completed",
      "owner": "",
      "sme": "Information Destruction Policy review and approval",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10083",
      "name": "Enterprise Security and Fraud Policy Governance Committee",
      "description": "Completed",
      "owner": "",
      "sme": "Enterprise Security and Fraud Policy Governance Committee",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10084",
      "name": "Vanguard third-party procurement contract templates include terms related to information security requirements",
      "description": "Completed",
      "owner": "",
      "sme": "Vanguard third-party procurement contract templates include terms related to information security requirements",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10085",
      "name": "Procurement Guidelines exist to outline the strategy for Supplier Lifecycle",
      "description": "Completed",
      "owner": "",
      "sme": "Procurement Guidelines exist to outline the strategy for Supplier Lifecycle",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10086",
      "name": "SWIFT SIEM rules are created and monitored through a formal process",
      "description": "Completed",
      "owner": "",
      "sme": "SWIFT SIEM rules are created and monitored through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10087",
      "name": "SWIFT SIEM rules are recertified annually through a formal process",
      "description": "In Review",
      "owner": "",
      "sme": "SWIFT SIEM rules are recertified annually through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10088",
      "name": "SIEM rules are created through a formal process",
      "description": "In Review",
      "owner": "",
      "sme": "SIEM rules are created through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10089",
      "name": "SIEM rules are recertified annually through a formal process",
      "description": "In Review",
      "owner": "",
      "sme": "SIEM rules are recertified annually through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10090",
      "name": "SWIFT lookup tables are recertified annually through a formal process",
      "description": "Completed",
      "owner": "",
      "sme": "SWIFT lookup tables are recertified annually through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10091",
      "name": "An Authentication Framework is in place for Vanguard’s externally facing client applications",
      "description": "Completed",
      "owner": "",
      "sme": "An Authentication Framework is in place for Vanguard’s externally facing client applications",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10092",
      "name": "Cloud vulnerability Issues are rated for risk according to predefined criteria.",
      "description": "In Progress",
      "owner": "",
      "sme": "Cloud vulnerability Issues are rated for risk according to predefined criteria.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Progress",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10093",
      "name": "Cloud vulnerability Findings are rated for risk according to predefined criteria.",
      "description": "In Progress",
      "owner": "",
      "sme": "Cloud vulnerability Findings are rated for risk according to predefined criteria.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Progress",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10094",
      "name": "Cloud vulnerabilities that cannot be remediated or remediated within SLA follow a formal acceptance process.",
      "description": "In Progress",
      "owner": "",
      "sme": "Cloud vulnerabilities that cannot be remediated or remediated within SLA follow a formal acceptance process.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Progress",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10095",
      "name": "The Technical Security Advisors team provides quarterly vulnerability risk reports to the CISO senior management.",
      "description": "Completed",
      "owner": "",
      "sme": "The Technical Security Advisors team provides quarterly vulnerability risk reports to the CISO senior management.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10096",
      "name": "An ad hoc vulnerability scan profile is defined in a standardized procedure.",
      "description": "Completed",
      "owner": "",
      "sme": "An ad hoc vulnerability scan profile is defined in a standardized procedure.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10097",
      "name": "Multifactor Authentication is enforced for all outgoing money movement transactions and for any changes made to high-risk data made by a client",
      "description": "Completed",
      "owner": "",
      "sme": "Multifactor Authentication is enforced for all outgoing money movement transactions and for any changes made to high-risk data made by a client",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10098",
      "name": "A Fraud and Corruption Control Plan exists to outline VIA’s fraud and corruption control approach and is reviewed annually",
      "description": "Completed",
      "owner": "",
      "sme": "A Fraud and Corruption Control Plan exists to outline VIA’s fraud and corruption control approach and is reviewed annually",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10099",
      "name": "Information security leadership and major programs responsibilities defined",
      "description": "Completed",
      "owner": "",
      "sme": "Information security leadership and major programs responsibilities defined",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10100",
      "name": "Global Security partners with the various service providers for travel security and threat intelligence.",
      "description": "Completed",
      "owner": "",
      "sme": "Global Security partners with the various service providers for travel security and threat intelligence.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10101",
      "name": "ES&F Global Enterprise Security / Governance, Risk and Control team has a CyberReg team which focuses on legal or regulatory requirements for cybersecurity.",
      "description": "Completed",
      "owner": "",
      "sme": "ES&F Global Enterprise Security / Governance, Risk and Control team has a CyberReg team which focuses on legal or regulatory requirements for cybersecurity.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10102",
      "name": "The CyberReg function receives key information from various stakeholders related to legal and regulatory requirements.",
      "description": "Completed",
      "owner": "",
      "sme": "The CyberReg function receives key information from various stakeholders related to legal and regulatory requirements.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10103",
      "name": "A post-mortem, including lessons learned, is conducted for all declared security incidents.",
      "description": "Completed",
      "owner": "",
      "sme": "A post-mortem, including lessons learned, is conducted for all declared security incidents.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10104",
      "name": "Detected events are rated for impact based on established criteria",
      "description": "Completed",
      "owner": "",
      "sme": "Detected events are rated for impact based on established criteria",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10105",
      "name": "An Insider Threat Protection Program is established to detect, prevent, or respond to insider threats.",
      "description": "Completed",
      "owner": "",
      "sme": "An Insider Threat Protection Program is established to detect, prevent, or respond to insider threats.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10106",
      "name": "Vulnerabilities are rated for risk according to predefined criteria.",
      "description": "Completed",
      "owner": "",
      "sme": "Vulnerabilities are rated for risk according to predefined criteria.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10107",
      "name": "Assets excluded from vulnerability scanning are reviewed and approved through a formal process",
      "description": "Completed",
      "owner": "",
      "sme": "Assets excluded from vulnerability scanning are reviewed and approved through a formal process",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10108",
      "name": "Vulnerabilities that cannot be remediated or remediated within SLA follow a formal exception process.",
      "description": "Completed",
      "owner": "",
      "sme": "Vulnerabilities that cannot be remediated or remediated within SLA follow a formal exception process.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10109",
      "name": "Assets excluded from vulnerability scanning are scanned semi-annually",
      "description": "Completed",
      "owner": "",
      "sme": "Assets excluded from vulnerability scanning are scanned semi-annually",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10110",
      "name": "Assets excluded from routine and semi-annually vulnerability scanning are documented as risks and recertified twice every year.",
      "description": "Completed",
      "owner": "",
      "sme": "Assets excluded from routine and semi-annually vulnerability scanning are documented as risks and recertified twice every year.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10111",
      "name": "Users are removed from Cisive in a timely manner following UARs and terminations",
      "description": "In Review",
      "owner": "",
      "sme": "Users are removed from Cisive in a timely manner following UARs and terminations",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10112",
      "name": "VGCP-05367: Global Security meets with Cisive every two weeks to provide updates and to notify the team of any changes.",
      "description": "Completed",
      "owner": "",
      "sme": "VGCP-05367: Global Security meets with Cisive every two weeks to provide updates and to notify the team of any changes.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10113",
      "name": "A nine-day bank hold is applied after changes are made to a client's account details",
      "description": "Completed",
      "owner": "",
      "sme": "A nine-day bank hold is applied after changes are made to a client's account details",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10114",
      "name": "Personal Investor IDPS accounts restricted to a maximum of one (1) external bank account linked to cash hub at any time",
      "description": "Not Started",
      "owner": "",
      "sme": "Personal Investor IDPS accounts restricted to a maximum of one (1) external bank account linked to cash hub at any time",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Not Started",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10115",
      "name": "Vanguard is responsible for managing Vendor adherence to the terms and conditions stated within their service agreements with Cisive.",
      "owner": "",
      "sme": "Vanguard is responsible for managing Vendor adherence to the terms and conditions stated within their service agreements with Cisive.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10116",
      "name": "Vanguard reviews results of Cisive's background checks immediately upon notification. Vanguard relies on Cisive to have effective controls surrounding data accuracy.",
      "owner": "",
      "sme": "Vanguard reviews results of Cisive's background checks immediately upon notification. Vanguard relies on Cisive to have effective controls surrounding data accuracy.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10117",
      "name": "All PII entered into Cisive is reviewed for accuracy and any discrepancies identified are communicated and revised as necessary.",
      "owner": "",
      "sme": "All PII entered into Cisive is reviewed for accuracy and any discrepancies identified are communicated and revised as necessary.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10118",
      "name": "All outbound e-mails sent to Cisive from Vanguard are appropriately protected and monitored",
      "description": "Completed",
      "owner": "",
      "sme": "All outbound e-mails sent to Cisive from Vanguard are appropriately protected and monitored",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10119",
      "name": "Logging and tracking for potential fraud at personal.vanguard.com are in place.",
      "description": "Not Started",
      "owner": "",
      "sme": "Logging and tracking for potential fraud at personal.vanguard.com are in place.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Not Started",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10120",
      "name": "An annual table-top exercise (TTX) is conducted of a scenario-based security event and action items are documented to address uncovered gaps.",
      "description": "Completed",
      "owner": "",
      "sme": "An annual table-top exercise (TTX) is conducted of a scenario-based security event and action items are documented to address uncovered gaps.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10121",
      "name": "NACHA - A Web Application Firewall is in place to mitigate attacks against the Personal Investor Website",
      "description": "Completed",
      "owner": "",
      "sme": "NACHA - A Web Application Firewall is in place to mitigate attacks against the Personal Investor Website",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10122",
      "name": "NACHA - Physical Security controls exist at Vanguard Data Centers and are evaluated annually for effectiveness",
      "description": "Completed",
      "owner": "",
      "sme": "NACHA - Physical Security controls exist at Vanguard Data Centers and are evaluated annually for effectiveness",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10123",
      "name": "NACHA - A process exists where new or updated accounts are validated before WEB debits can occur",
      "description": "Completed",
      "owner": "",
      "sme": "NACHA - A process exists where new or updated accounts are validated before WEB debits can occur",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10124",
      "name": "Business Impact Assessments (BIAs) are required for all new applications and when existing systems are upgraded.",
      "description": "In Review",
      "owner": "",
      "sme": "Business Impact Assessments (BIAs) are required for all new applications and when existing systems are upgraded.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10125",
      "name": "NACHA - IT Application Security assessments are performed periodically and at consistent intervals to identify any new vulnerabilities that are dispositioned in accordance with Vanguard requirements.",
      "description": "In Review",
      "owner": "",
      "sme": "NACHA - IT Application Security assessments are performed periodically and at consistent intervals to identify any new vulnerabilities that are dispositioned in accordance with Vanguard requirements.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10126",
      "name": "A risk assessment methodology and program exists to determine the testing frequency of assets",
      "description": "In Review",
      "owner": "",
      "sme": "A risk assessment methodology and program exists to determine the testing frequency of assets",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10127",
      "name": "A risk assessment methodology and program exists to determine how risks are to be treated",
      "description": "In Review",
      "owner": "",
      "sme": "A risk assessment methodology and program exists to determine how risks are to be treated",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10128",
      "name": "NACHA - Vanguard maintains architecture diagrams for infrastructure hosting personal.vanguard.com and client bank instruction information.",
      "description": "In Review",
      "owner": "",
      "sme": "NACHA - Vanguard maintains architecture diagrams for infrastructure hosting personal.vanguard.com and client bank instruction information.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10129",
      "name": "Access to DB2 tables containing banking instruction data follows the enterprise process.",
      "description": "In Review",
      "owner": "",
      "sme": "Access to DB2 tables containing banking instruction data follows the enterprise process.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "In Review",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    },
    {
      "id": "VGCP-10130",
      "name": "A network reconciliation is conducted to detect networks missing from Qualys and remediate the discrepancies to support breadth-of-coverage.",
      "description": "Completed",
      "owner": "",
      "sme": "A network reconciliation is conducted to detect networks missing from Qualys and remediate the discrepancies to support breadth-of-coverage.",
      "needsEscalation": false,
      "dat": {
        "status": "Not Started"
      },
      "oet": {
        "status": "Not Started"
      },
      "testingNotes": "Completed",
      "startDate": null,
      "dueDate": null,
      "eta": null,
      "completedDate": null
    }
  ],
  "rawCount": 131,
  "sheet": "2025 Controls"
}

// Small pools of realistic-looking names to fill missing fields so the UI
// displays useful data during development.
const _sampleOwners = [
  'Alice Johnson',
  'Bob Smith',
  'Carol Lee',
  'David Nguyen',
  'Emma Thompson',
  'Frank Miller',
  'Grace Hopper',
  'Hector Alvarez',
]
const _sampleSMEs = ['Carlos Rivera', 'Dana White', 'Ivy Patel', 'Jamal Carter', 'Kira Matsumoto']
const _sampleTesters = ['Morgan Lee', 'Eve Tester', 'Frank Auditor', 'Selina Park', 'Noah Brooks']

function _fmtDate(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const mockControls: Control[] = (_normalizedPayload.normalized as any[]).map((r, i) => {
  // choose sensible defaults when the sheet left fields blank
  const owner = r.owner && String(r.owner).trim() ? String(r.owner) : _sampleOwners[i % _sampleOwners.length]
  const sme = r.sme && String(r.sme).trim() ? String(r.sme) : _sampleSMEs[i % _sampleSMEs.length]
  const tester = _sampleTesters[i % _sampleTesters.length]

  // If the sheet didn't provide dates, assign a deterministic, sensible date range
  // so Kanban / Summary views show useful timelines.
  let startDateStr: string | undefined = r.startDate ? String(r.startDate) : undefined
  if (!startDateStr) {
    // start dates distributed across Aug-Sep 2025
    const sd = new Date(2025, 7, 1 + (i % 60))
    startDateStr = _fmtDate(sd)
  }
  let dueDateStr: string | undefined = r.dueDate ? String(r.dueDate) : undefined
  if (!dueDateStr && startDateStr) {
    const sd = new Date(startDateStr)
    sd.setDate(sd.getDate() + 30 + (i % 10))
    dueDateStr = _fmtDate(sd)
  }
  let completedDateStr: string | undefined = r.completedDate ? String(r.completedDate) : undefined
  if (!completedDateStr && /completed/i.test(String(r.testingNotes || ''))) {
    // if testingNotes indicates completion, set a completed date a few days after due
    if (dueDateStr) {
      const dd = new Date(dueDateStr)
      dd.setDate(dd.getDate() + (i % 7))
      completedDateStr = _fmtDate(dd)
    }
  }

  return {
    id: String(r.id),
    name: String(r.name || ''),
    ...(r.description ? { description: String(r.description) } : {}),
    owner,
    ...(sme ? { sme } : {}),
    ...(tester ? { tester } : {}),
    needsEscalation: Boolean(r.needsEscalation),
    dat: { status: (r.dat?.status ?? 'Not Started') as any, ...(r.dat?.step ? { step: r.dat.step } : {}) },
    oet: { status: (r.oet?.status ?? 'Not Started') as any, ...(r.oet?.step ? { step: r.oet.step } : {}) },
    ...(r.testingNotes ? { testingNotes: String(r.testingNotes) } : {}),
    ...(startDateStr ? { startDate: startDateStr } : {}),
    ...(dueDateStr ? { dueDate: dueDateStr } : {}),
    ...(r.eta ? { eta: String(r.eta) } : {}),
    ...(completedDateStr ? { completedDate: completedDateStr } : {}),
  }
})

export const mockRequests: TestRequest[] = [
  {
    id: 'r' + String(Date.now() - 1000000),
    controlId: 'VGCP-00001',
    requestedBy: 'Grace QA',
    scope: 'Provide MFA enrollment evidence for all admin accounts for Q3.',
    dueDate: '2025-10-10',
    status: 'Pending',
  },
  {
    id: 'r' + String(Date.now() - 500000),
    controlId: 'VGCP-00002',
    requestedBy: 'Henry Auditor',
    scope: 'Provide last two encryption key rotation events and related tickets.',
    dueDate: '2025-09-20',
    status: 'In Progress',
  },
  {
    id: 'r' + String(Date.now()),
    controlId: 'VGCP-00003',
    requestedBy: 'Ivy Analyst',
    scope: 'Attach SAST report for release v1.4.0',
    dueDate: '2025-11-01',
    status: 'Complete',
  },
]

export default {
  mockControls,
  mockRequests,
}

// Helpers to mutate the in-memory mock data during development/testing.
export function generateVGCPId(): string {
  // Try to find the max numeric suffix and increment
  const nums = mockControls
    .map((c) => {
      const m = String(c.id).match(/(\d{5})$/)
      return m ? Number(m[1]) : NaN
    })
    .filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  const next = (max + 1).toString().padStart(5, '0')
  return `VGCP-${next}`
}

export function addMockControl(c: Control): Control {
  mockControls.push(c)
  return c
}

export function addMockRequest(r: TestRequest): TestRequest {
  mockRequests.push(r)
  return r
}

export function updateMockControl(id: string, patch: Partial<Control>): Control | undefined {
  const idx = mockControls.findIndex((c) => c.id === id)
  if (idx === -1) return undefined
  mockControls[idx] = { ...mockControls[idx], ...patch }
  return mockControls[idx]
}
