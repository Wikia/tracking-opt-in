/*
  IAB CMP vendor IDs of Fandom's ad partners
  The IDs are taken from https://vendorlist.consensu.org/v2/vendor-list.json
  [STATUS] GVL Name (TCFv1 name)
  Last GVL check:  2020-10-06
  Last update:     2020-10-06
 */
export const IAB_VENDORS = [
    58,  // 33Across
    147, // Adacado
    57,  // Adara Media
    299, // AdClear
    50,  // Adform (Adform A/S)
    15,  // Adikteev
    93,  // Adloox
    447, // Adludio
    151, // Admedo
    22,  // Admetrics
    264, // Adobe Advertising Cloud
    66,  // adsquare GmbH
    827, // AdTriba
    195, // advanced STORE GmbH
    27,  // Adventori
    793, // Amazon Advertising
    23,  // Amobee
    394, // AudienceProject
    63,  // Avocet
    273, // Bannerflow
    335, // Beachfront Media LLC
    12,  // Beeswax
    128, // BIDSWITCH GmbH
    94,  // Blis Media
    156, // Centro
    315, // Celtra, Inc.
    734, // Cint
    767, // Clinch
    243, // Cloud Technologies
    416, // Commanders Act
    77,  // comScore, Inc.
    85,  // Crimtan Holdings Limited
    91,  // Criteo
    298, // Cuebiq Inc.
    209, // Delta Projects
    707, // Dentsu Aegis Network
    761, // Digiseg
    144, // district m inc.
    754, // DistroScale, Inc.
    126, // DoubleVerify Inc.
    674, // Duration Media, LLC.
    110, // Dynata LLC
    168, // EASYmedia
    688, // Effinity
    213, // emetriq
    853, // Ensighten
    312, // Exactag
    1,   // Exponential
    120, // Eyeota Ptd Ltd
    78,  // Flashtalking, Inc.
    119, // FUSIO BY S4M
    328, // Gemius
    758, // GfK
    755, // Google Advertising Products
    98,  // GroupM UK Limited (GroupM)
    61,  // GumGum, Inc.
    606, // Impactify
    10,  // Index Exchange, Inc.
    452, // Innovid Inc.
    278, // Integral Ad Science, Inc. (IAS)
    129, // IPONWEB
    294, // Jivox
    62,  // Justpremium BV
    544, // Kochava
    67,  // LifeStreet
    667, // Liftoff
    97,  // LiveRamp, Inc.
    587, // Localsensor
    109, // LoopMe
    95,  // Lotame Solutions, Inc.
    578, // [MISSING] MAIRDUMONT NETLETIX GmbH&Co. KG
    228, // McCann Discipline LTD
    79,  // MediaMath, Inc.
    152, // Meetrics
    703, // MindTake Research
    101, // MiQ
    807, // Moloco Ads
    72,  // Nano Interactive
    450, // Neodata Group
    34,  // NEORY GmbH
    37,  // Neural.ONE
    468, // Neustar, Inc.
    577, // Neustar on behalf of The Procter & Gamble Company
    130, // NextRoll, Inc.
    373, // Nielsen Marketing Cloud (Exelate)
    816, // NoBid, Inc.
    388, // numberly
    832, // Objective Partners
    304, // On Device Research
    241, // OneTag
    69,  // OpenX (OpenX Software Ltd. and its affiliates)
    349, // Optomaton
    385, // Oracle Data Cloud (Oracle, BlueKai)
    772, // Oracle Data Cloud - MOAT
    559, // OTTO
    139, // PERMODO
    384, // Pixalate
    140, // Platform161
    177, // plista GmbH
    762, // Protected Media
    226, // Publicis Media
    76,  // PubMatic, Inc.
    81,  // [MISSING] PulsePoint, Inc.
    11,  // Quantcast International Limited
    60,  // Rakuten Marketing
    631, // Relay42
    192, // Remerge
    787, // Resolution Media
    36,  // RhythmOne DBA Unruly Group Ltd (RhythmOne, LLC)
    71,  // Roku Advertising Services (Dataxu, Inc.)
    4,   // Roq.ad
    16,  // RTB House
    506, // [MISSING] salesforce.com, inc.
    86,  // Scene Stealer Limited
    415, // Seenthis
    775, // SelectMedia International LTD
    84,  // Semasio GmbH
    59,  // Sift Media
    261, // Signal Digital Inc.
    73,  // Simplifi Holdings Inc.
    68,  // Sizmek by Amazon (Sizmek)
    82,  // Smaato
    161, // Smadex
    45,  // Smart Adserver
    546, // Smart Trafik
    246, // Smartology
    295, // Sojern
    13,  // Sovrn Holdings Inc
    165, // SpotX, Inc. (SpotX)
    137, // Ströer SSP GmbH (DSP)
    136, // Ströer SSP GmbH (SSP)
    114, // Sublime
    275, // TabMo
    42,  // Taboola
    466, // TACTIC™ Real-Time Marketing
    132, // Teads
    522, // [MISSING] Tealium Inc
    124, // TEEMO
    202, // Telaria, Inc
    345, // The Kantar Group Limited
    52,  // The Rubicon Project, Inc. (The Rubicon Project, Limited)
    21,  // The Trade Desk (The Trade Desk, Inc and affiliated companies)
    423, // travel audience – An Amadeus Company
    88,  // TreSensa
    28,  // TripleLift, Inc.
    162, // Unruly Group Ltd
    212, // usemax (Emego GmbH)
    25,  // Verizon Media EMEA Limited (Oath (EMEA) Limited)
    601, // WebAds B.V
    284, // Weborama
    431, // White Ops
    18,  // Widespace
    281, // Wizaly
    32,  // Xandr, Inc. (AppNexus Inc.)
    173, // YieldMo
];

/*
  Fandom's ad partners who are not affiliated with IAB
  182, // EMX Digital LLC (RealTime)
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
