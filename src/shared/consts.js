/*
  IAB CMP vendor IDs of Fandom's ad partners
  The IDs are taken from https://vendorlist.consensu.org/v2/vendor-list.json
  [STATUS] GVL Name (TCFv1 name)
  Last GVL check:  2020-09-02
  Last update:     2020-09-02
 */
export const IAB_VENDORS = [
    58,  // 33Across
    50,  // Adform (Adform A/S)
    264, // Adobe Advertising Cloud
    66,  // adsquare GmbH
    793, // Amazon Advertising
    335, // Beachfront Media LLC
    128, // BIDSWITCH GmbH
    315, // Celtra, Inc.
    77,  // comScore, Inc.
    85,  // Crimtan Holdings Limited
    298, // [MISSING] Cuebiq Inc.
    144, // district m inc.
    754, // DistroScale, Inc.
    126, // DoubleVerify Inc.
    674, // Duration Media, LLC.
    120, // Eyeota Ptd Ltd
    78,  // Flashtalking, Inc.
    // 755, // Google Advertising Products
    98,  // GroupM UK Limited (GroupM)
    61,  // GumGum, Inc.
    10,  // Index Exchange, Inc.
    278, // Integral Ad Science, Inc. (IAS)
    62,  // Justpremium BV
    97,  // LiveRamp, Inc.
    95,  // Lotame Solutions, Inc.
    578, // [MISSING] MAIRDUMONT NETLETIX GmbH&Co. KG
    228, // McCann Discipline LTD
    79,  // MediaMath, Inc.
    101, // MiQ
    468, // Neustar, Inc.
    373, // Nielsen Marketing Cloud (Exelate)
    816, // NoBid, Inc.
    69,  // OpenX (OpenX Software Ltd. and its affiliates)
    385, // Oracle Data Cloud (Oracle, BlueKai)
    177, // plista GmbH
    76,  // PubMatic, Inc.
    81,  // [MISSING] PulsePoint, Inc.
    11,  // Quantcast International Limited
    36,  // RhythmOne DBA Unruly Group Ltd (RhythmOne, LLC)
    71,  // Roku Advertising Services (Dataxu, Inc.)
    506, // [MISSING] salesforce.com, inc.
    261, // Signal Digital Inc.
    13,  // Sovrn Holdings Inc
    165, // SpotX, Inc. (SpotX)
    522, // [MISSING] Tealium Inc
    202, // Telaria, Inc
    345, // The Kantar Group Limited
    52,  // The Rubicon Project, Inc. (The Rubicon Project, Limited)
    21,  // The Trade Desk (The Trade Desk, Inc and affiliated companies)
    28,  // TripleLift, Inc.
    162, // Unruly Group Ltd
    25,  // Verizon Media EMEA Limited (Oath (EMEA) Limited)
    601, // WebAds B.V
    32,  // Xandr, Inc. (AppNexus Inc.)
];

/*
  Fandom's ad partners who are not affiliated with IAB
  182, // EMX Digital LLC (RealTime)
  68,  // Sizmek by Amazon (Sizmek)
 */
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
        name: 'First Impression',
        policyUrl: 'https://publishers.firstimpression.io/#FI/privacy-policy',
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

export function getNonIABVendors() {
    return NON_IAB_VENDORS;
}

export function addNonIABVendors(vendors) {
    vendors.forEach(element => NON_IAB_VENDORS.push(element));
}
