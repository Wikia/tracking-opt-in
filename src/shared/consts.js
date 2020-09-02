// IAB CMP vendor IDs of Fandom's ad partners
// The IDs are taken from https://vendorlist.consensu.org/vendorlist.json
export const IAB_VENDORS = [
    56,  // 33Across
    50,  // Adform A/S
    264, // Adobe Advertising Cloud
    66,  // adsquare GmbH
    793, // Amazon Advertising
    32,  // AppNexus Inc.
    335, // Beachfront Media LLC
    128, // BIDSWITCH GmbH
    315, // Celtra, Inc.
    77,  // comScore, Inc.
    85,  // Crimtan Holdings Limited
    298, // Cuebiq Inc.
    71,  // Dataxu, Inc.
    144, // district m inc.
    754, // DistroScale, Inc.
    126, // DoubleVerify Inc.
    674, // Duration Media, LLC.
    120, // Eyeota Ptd Ltd
    78,  // Flashtalking, Inc.
    98,  // GroupM
    61,  // GumGum, Inc.
    10,  // Index Exchange, Inc.
    278, // Integral Ad Science, Inc. (IAS)
    62,  // Justpremium BV
    97,  // LiveRamp, Inc.
    95,  // Lotame Solutions, Inc.
    578, // MAIRDUMONT NETLETIX GmbH&Co. KG
    228, // McCann Discipline LTD
    79,  // MediaMath, Inc.
    101, // MiQ
    468, // Neustar, Inc.
    373, // Nielsen Marketing Cloud (Exelate)
    816, // NoBid, Inc.
    25,  // Oath (EMEA) Limited
    69,  // OpenX Software Ltd. and its affiliates
    385, // Oracle (BlueKai)
    177, // plista GmbH
    76,  // PubMatic, Inc.
    81,  // PulsePoint, Inc.
    11,  // Quantcast International Limited
    36,  // RhythmOne, LLC
    506, // salesforce.com, inc.
    261, // Signal Digital Inc.
    13,  // Sovrn Holdings Inc
    165, // SpotX
    522, // Tealium Inc
    202, // Telaria, Inc
    345, // The Kantar Group Limited
    52,  // The Rubicon Project, Limited
    21,  // The Trade Desk, Inc and affiliated companies
    28,  // TripleLift, Inc.
    162, // Unruly Group Ltd
    25,  // Verizon Media EMEA Limited
    601, // WebAds B.V
];

// Fandom's ad partners who are not affiliated with IAB
export const NON_IAB_VENDORS = [
    {
        name: '2 Audiens',
        policyUrl: 'https://www.audience2media.com/privacy',
    },
    {
        name: '4Media Network',
        policyUrl: 'http://4media-network.com/privacy.html',
    },
    {
        name: 'Acxiom',
        policyUrl: 'https://www.acxiom.co.uk/about-acxiom/privacy/uk-privacy-policy',
    },
    {
        name: 'Branch',
        policyUrl: 'https://branch.io/policies/#privacyb',
    },
    {
        name: 'Cross Media',
        policyUrl: 'http://crossmedia.co.uk/en/privacy-policy',
    },
    {
        name: 'CultureG',
        policyUrl: 'https://www.cultureg.eu/privacy-policy.html',
    },
    {
        name: 'Datorama',
        policyUrl: 'https://datorama.com/privacy-policy',
    },
    {
        name: 'DataXpand',
        policyUrl: 'http://www.dataxpand.com/privacy.php',
    },
    {
        name: 'Datonics',
        policyUrl: 'https://www.datonics.com/privacy',
    },
    {
        name: 'DBM',
        policyUrl: 'https://policies.google.com/privacy',
    },
    {
        name: 'DCM',
        policyUrl: 'https://policies.google.com/privacy',
    },
    {
        name: 'DFP (Google)',
        policyUrl: 'https://policies.google.com/privacy?hl=en',
    },
    {
        name: 'DV360',
        policyUrl: 'https://policies.google.com/privacy',
    },
    {
        name: 'Epsilon',
        policyUrl: 'https://www.epsilontel.com/privacy-policy',
    },
    {
        name: 'Experian',
        policyUrl: 'https://www.experian.co.uk/legal/privacy-statement.html',
    },
    {
        name: 'Fabric / Crashlytics',
        policyUrl: 'https://fabric.io/terms',
    },
    {
        name: 'Facebook Audience Network',
        policyUrl: 'https://developers.facebook.com/docs/audience-network/policy',
    },
    {
        name: 'Facebook SDK',
        policyUrl: 'https://www.facebook.com/about/privacy',
    },
    {
        name: 'Fastly',
        policyUrl: 'https://www.fastly.com/privacy',
    },
    {
        name: 'Firebase',
        policyUrl: 'https://policies.google.com/privacy?hl=en',
    },
    {
        name: 'First Impression',
        policyUrl: 'https://publishers.firstimpression.io/#FI/privacy-policy',
    },
    {
        name: 'Google Ads IMA SDK',
        policyUrl: 'https://policies.google.com/privacy',
    },
    {
        name: 'Google Mobile Ads SDK for iOS',
        policyUrl: 'https://policies.google.com/privacy',
    },
    {
        name: 'Google Play Services',
        policyUrl: 'https://policies.google.com/privacy',
    },
    {
        name: 'I-Behavior',
        policyUrl: 'https://www.i-behavior.com/interactive-marketing/privacy-policydata-security-qa',
    },
    {
        name: 'InstartLogic',
        policyUrl: 'https://www.instartlogic.com/company/legal/privacy-policy',
    },
    {
        name: 'JW Player',
        policyUrl: 'https://www.jwplayer.com/privacy',
    },
    {
        name: 'KBM Group',
        policyUrl: 'http://www.kbmg.com/about-us/privacy/site-privacy-policy',
    },
    {
        name: 'LiftIgniter',
        policyUrl: 'https://www.liftigniter.com/terms-and-privacy-policy',
    },
    {
        name: 'M United / McCann',
        policyUrl: 'https://www.mccannworldgroup.com/privacy',
    },
    {
        name: 'Madhive',
        policyUrl: 'https://madhive.com/privacy.html',
    },
    {
        name: 'Maxpoint / Valassis Digital',
        policyUrl: 'https://www.valassisdigital.com/legal/privacy-policy',
    },
    {
        name: 'Moat',
        policyUrl: 'https://moat.com/privacy',
    },
    {
        name: 'Moat UK',
        policyUrl: 'https://www.moat.co.uk/privacy-statement',
    },
    {
        name: 'Navegg',
        policyUrl: 'https://www.navegg.com/en/privacy-policy',
    },
    {
        name: 'PageFair',
        policyUrl: 'https://pagefair.com/privacy',
    },
    {
        name: 'Parsely',
        policyUrl: 'https://www.parse.ly/privacy-policy',
    },
    {
        name: 'Qualaroo',
        policyUrl: 'https://qualaroo.com/privacy-policy',
    },
    {
        name: 'Qualtrics',
        policyUrl: 'https://www.qualtrics.com/privacy-statement',
    },
    {
        name: 'RealTime',
        policyUrl: 'http://www.brealtime.com/privacy-policy',
    },
    {
        name: 'Schnee Von Morgan',
        policyUrl: 'https://www.schneevonmorgen.com/privacy.html',
    },
    {
        name: 'SimpleReach',
        policyUrl: 'https://simplereach.com/privacy',
    },
    {
        name: 'Sizmek',
        policyUrl: 'https://www.sizmek.com/privacy-policy',
    },
    {
        name: 'Switch Concepts',
        policyUrl: 'https://www.switchconcepts.com/privacy-policy',
    },
    {
        name: 'TruSignal',
        policyUrl: 'https://www.tru-signal.com/site-privacy-policy',
    },
    {
        name: 'Truvid',
        policyUrl: 'https://www.truvid.com/terms/privacy_policy',
    },
    {
        name: 'Vertical Mass',
        policyUrl: 'http://site.verticalmass.com/privacy',
    },
    {
        name: 'VisualDNA',
        policyUrl: 'https://www.visualdna.com/privacy-policy',
    },
];
