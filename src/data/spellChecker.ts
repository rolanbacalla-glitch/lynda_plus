export interface SpellingIssue {
  start: number;
  end: number;
  word: string;
  suggestion: string;
  suggestions: string[];
  highConfidence: boolean;
}

export interface AutoCorrectResult {
  text: string;
  cursorPos: number;
  corrected?: {
    from: string;
    to: string;
    start: number;
  };
}

// Explicit high-confidence typo corrections (checked first for O(1) accuracy)
const COMMON_TYPOS: Record<string, string> = {
  prject: 'project',
  projct: 'project',
  porject: 'project',
  proejct: 'project',
  projeect: 'project',
  prjects: 'projects',
  projcts: 'projects',
  teh: 'the',
  hte: 'the',
  adn: 'and',
  nad: 'and',
  taht: 'that',
  tht: 'that',
  wiht: 'with',
  wtih: 'with',
  fomr: 'from',
  youre: "you're",
  yur: 'your',
  yoru: 'your',
  thier: 'their',
  recieve: 'receive',
  recieved: 'received',
  recieving: 'receiving',
  acheive: 'achieve',
  achive: 'achieve',
  acheiving: 'achieving',
  achiving: 'achieving',
  acheived: 'achieved',
  proccess: 'process',
  proces: 'process',
  procces: 'process',
  prosess: 'process',
  experiance: 'experience',
  exprience: 'experience',
  experince: 'experience',
  usabilty: 'usability',
  usabillity: 'usability',
  usablity: 'usability',
  reseach: 'research',
  reserch: 'research',
  reasearch: 'research',
  reseacher: 'researcher',
  resercher: 'researcher',
  queston: 'question',
  qustion: 'question',
  questoin: 'question',
  questons: 'questions',
  particpant: 'participant',
  participent: 'participant',
  particpants: 'participants',
  chekout: 'checkout',
  checkot: 'checkout',
  checout: 'checkout',
  feeback: 'feedback',
  feddback: 'feedback',
  feedbak: 'feedback',
  navigaton: 'navigation',
  navagation: 'navigation',
  navgiation: 'navigation',
  interveiw: 'interview',
  intervew: 'interview',
  intreview: 'interview',
  interveiws: 'interviews',
  prototpe: 'prototype',
  protype: 'prototype',
  prottype: 'prototype',
  objectve: 'objective',
  objecive: 'objective',
  obejctive: 'objective',
  purpse: 'purpose',
  purpuse: 'purpose',
  prupose: 'purpose',
  definately: 'definitely',
  defintely: 'definitely',
  seperate: 'separate',
  occured: 'occurred',
  untill: 'until',
  wierd: 'weird',
  becuase: 'because',
  becasue: 'because',
  beacuse: 'because',
  imporve: 'improve',
  improvment: 'improvement',
  custmer: 'customer',
  customr: 'customer',
  custmers: 'customers',
  dashbaord: 'dashboard',
  dashbord: 'dashboard',
  permision: 'permission',
  permisions: 'permissions',
  permisson: 'permission',
  subcription: 'subscription',
  subscirption: 'subscription',
  subscripiton: 'subscription',
  onbaording: 'onboarding',
  onbording: 'onboarding',
  onboading: 'onboarding',
  frustating: 'frustrating',
  frustratng: 'frustrating',
  confusng: 'confusing',
  confussing: 'confusing',
  desgin: 'design',
  deisgn: 'design',
  desginer: 'designer',
  featue: 'feature',
  feautre: 'feature',
  featues: 'features',
  compelte: 'complete',
  complte: 'complete',
  compleet: 'complete',
  understandng: 'understanding',
  undestand: 'understand',
  wrkflow: 'workflow',
  workfow: 'workflow',
  wrokflow: 'workflow',
  biling: 'billing',
  billng: 'billing',
  paymnt: 'payment',
  payemnt: 'payment',
  paymet: 'payment',
  acount: 'account',
  accout: 'account',
  acocunt: 'account',
  mesage: 'message',
  messge: 'message',
  informtion: 'information',
  infomation: 'information',
  enviroment: 'environment',
  managment: 'management',
  developement: 'development',
  sucess: 'success',
  succesful: 'successful',
  diffrent: 'different',
  diferent: 'different',
  importnt: 'important',
  improtant: 'important',
  neccessary: 'necessary',
  necesary: 'necessary',
  recomend: 'recommend',
  reccomend: 'recommend',
  avaliable: 'available',
  availble: 'available',
  buisness: 'business',
  busines: 'business',
  goverment: 'government',
  calender: 'calendar',
  knowlege: 'knowledge',
  langauge: 'language',
  privcy: 'privacy',
  secuity: 'security',
  verfication: 'verification',
  authetication: 'authentication',
  anlytics: 'analytics',
  syntheis: 'synthesis',
  sumary: 'summary',
  testng: 'testing',
  teting: 'testing',
  tesing: 'testing',
  valdiate: 'validate',
  validte: 'validate',
  valdiation: 'validation',
  scrren: 'screen',
  scren: 'screen',
  clik: 'click',
  clcik: 'click',
  buton: 'button',
  buttn: 'button',
  reivew: 'review',
  reveiw: 'review',
  reveiwing: 'reviewing',
  enjyed: 'enjoyed',
  enjoed: 'enjoyed',
  explian: 'explain',
  explan: 'explain',
  documnt: 'document',
  docment: 'document',
  stduy: 'study',
  sutdy: 'study',
  reslut: 'result',
  resluts: 'results',
  insght: 'insight',
  insghts: 'insights',
  sesson: 'session',
  sesison: 'session',
  sessons: 'sessions',
  gaol: 'goal',
  gola: 'goal',
  gaols: 'goals',
  taem: 'team',
  tema: 'team',
  usre: 'user',
  uesr: 'user',
  usres: 'users',
  prduct: 'product',
  prodcut: 'product',
  prodct: 'product',
  servce: 'service',
  serivce: 'service',
  seting: 'setting',
  setings: 'settings',
  upgarde: 'upgrade',
  upgrde: 'upgrade',
  anual: 'annual',
  mothly: 'monthly',
  weeky: 'weekly',
  daliy: 'daily',
  confrim: 'confirm',
  confim: 'confirm',
  confirmng: 'confirming',
  returing: 'returning',
  retunring: 'returning',
  admn: 'admin',
  admns: 'admins',
  proraton: 'proration',
  clarty: 'clarity',
  clarit: 'clarity',
  aduit: 'audit',
  audti: 'audit',
  wrokspace: 'workspace',
  workspce: 'workspace',
  workpsace: 'workspace',
  complience: 'compliance',
  compiance: 'compliance',
  redcton: 'redaction',
  netral: 'neutral',
  nuetral: 'neutral',
  netrality: 'neutrality',
  baise: 'bias',
  baised: 'biased',
  leanding: 'leading',
  primng: 'priming',
  hypotetical: 'hypothetical',
  behavor: 'behaviour',
  behavour: 'behaviour',
  frcton: 'friction',
  hesitaton: 'hesitation',
  compresion: 'comprehension',
  stakholder: 'stakeholder',
  stakehodler: 'stakeholder',
  engneering: 'engineering',
  enginer: 'engineer',
  designr: 'designer',
  managr: 'manager',
  manger: 'manager',
  spint: 'sprint',
  raodmap: 'roadmap',
  backlg: 'backlog',
  integraton: 'integration',
  conect: 'connect',
  conection: 'connection',
  recruting: 'recruiting',
  recritment: 'recruitment',
  pannel: 'panel',
  panlist: 'panellist',
  panellst: 'panellist',
  screner: 'screener',
  guidlines: 'guidelines',
  guidelins: 'guidelines',
  tempalte: 'template',
  templete: 'template',
  sumbit: 'submit',
  submt: 'submit',
  cancl: 'cancel',
  contine: 'continue',
  contiune: 'continue',
  pubish: 'publish',
  publsih: 'publish',
  launc: 'launch',
  lauch: 'launch',
  preveiw: 'preview',
  preivew: 'preview',
  recrod: 'record',
  recroding: 'recording',
  transcipt: 'transcript',
  trancript: 'transcript',
  hightlight: 'highlight',
  highlite: 'highlight',
  anlysis: 'analysis',
  anaylsis: 'analysis',
  metirc: 'metric',
  metrcs: 'metrics',
  questonnaire: 'questionnaire',
  suvery: 'survey',
  survye: 'survey',
  walkthough: 'walkthrough',
  walktrhough: 'walkthrough',
  moblie: 'mobile',
  mobiel: 'mobile',
  desktp: 'desktop',
  browsr: 'browser',
  broswer: 'browser',
  interfce: 'interface',
  inteface: 'interface',
  expecation: 'expectation',
  expection: 'expectation',
  chalenge: 'challenge',
  challege: 'challenge',
  probelm: 'problem',
  problme: 'problem',
  soluton: 'solution',
  soltuion: 'solution',
  decison: 'decision',
  decsion: 'decision',
  decisons: 'decisions',
  achiveing: 'achieving',
  whne: 'when',
  wehn: 'when',
  waht: 'what',
  whta: 'what',
  hwere: 'where',
  whre: 'where',
  whihc: 'which',
  wich: 'which',
  woudl: 'would',
  wuold: 'would',
  shoudl: 'should',
  shuold: 'should',
  coudl: 'could',
  cuold: 'could',
  abotu: 'about',
  abuot: 'about',
  thsi: 'this',
  htis: 'this',
  thse: 'these',
  thsoe: 'those',
  tehy: 'they',
  htey: 'they',
  thne: 'then',
  tahn: 'than',
  hav: 'have',
  hvae: 'have',
  ahve: 'have',
  formt: 'format',
  firts: 'first',
  frist: 'first',
  secnd: 'second',
  seocnd: 'second',
  thrid: 'third',
  peopel: 'people',
  poeple: 'people',
  persn: 'person',
  writting: 'writing',
  wirte: 'write',
  wriet: 'write',
  tpye: 'type',
  tyep: 'type',
  tpying: 'typing',
  speling: 'spelling',
  spellng: 'spelling',
  corect: 'correct',
  corret: 'correct',
  wrog: 'wrong',
  worng: 'wrong',
  eror: 'error',
  errror: 'error',
  isue: 'issue',
  isues: 'issues',
  issuse: 'issues',
  chage: 'change',
  chagne: 'change',
  chages: 'changes',
  upate: 'update',
  udapte: 'update',
  upates: 'updates',
  craete: 'create',
  cerate: 'create',
  cretae: 'create',
  delte: 'delete',
  dlete: 'delete',
  remvoe: 'remove',
  reomve: 'remove',
  serach: 'search',
  saerch: 'search',
  fliter: 'filter',
  flter: 'filter',
  selct: 'select',
  slect: 'select',
  chocie: 'choice',
  choise: 'choice',
  optin: 'option',
  opton: 'option',
  optins: 'options',
  shwo: 'show',
  hied: 'hide',
  opne: 'open',
  clsoe: 'close',
  strat: 'start',
  satrt: 'start',
  fnish: 'finish',
  finsh: 'finish',
  begi: 'begin',
  begni: 'begin',
  stpe: 'step',
  stpes: 'steps',
  flwo: 'flow',
  flwos: 'flows',
  taks: 'task',
  tsak: 'task',
  takss: 'tasks',
  goup: 'group',
  gorup: 'group',
  mebmer: 'member',
  memebr: 'member',
  invtie: 'invite',
  ivnite: 'invite',
  shrae: 'share',
  sahre: 'share',
  exprot: 'export',
  epxort: 'export',
  improt: 'import',
  ipmort: 'import',
  uploda: 'upload',
  uload: 'upload',
  downlaod: 'download',
  donwload: 'download',
  payemnts: 'payments',
  invocie: 'invoice',
  invoce: 'invoice',
  prcing: 'pricing',
  pricng: 'pricing',
  pircing: 'pricing',
  trila: 'trial',
  tiral: 'trial',
  plna: 'plan',
  pnal: 'plan',
  teir: 'tier',
  seast: 'seats',
  saet: 'seat',
  saets: 'seats',
  // British English standardisation (US -> UK)
  analyze: 'analyse',
  analyzed: 'analysed',
  analyzing: 'analysing',
  anonymize: 'anonymise',
  anonymized: 'anonymised',
  anonymization: 'anonymisation',
  authorize: 'authorise',
  authorized: 'authorised',
  authorization: 'authorisation',
  unauthorized: 'unauthorised',
  behavior: 'behaviour',
  behaviors: 'behaviours',
  behavioral: 'behavioural',
  canceled: 'cancelled',
  canceling: 'cancelling',
  catalog: 'catalogue',
  categorize: 'categorise',
  categorized: 'categorised',
  center: 'centre',
  centered: 'centred',
  color: 'colour',
  colors: 'colours',
  customize: 'customise',
  customized: 'customised',
  defense: 'defence',
  democratize: 'democratise',
  favor: 'favour',
  favorite: 'favourite',
  finalize: 'finalise',
  finalized: 'finalised',
  fulfill: 'fulfil',
  gray: 'grey',
  honor: 'honour',
  judgment: 'judgement',
  labeled: 'labelled',
  labeling: 'labelling',
  labor: 'labour',
  maximize: 'maximise',
  minimize: 'minimise',
  modeling: 'modelling',
  neighbor: 'neighbour',
  neutralize: 'neutralise',
  neutralized: 'neutralised',
  offense: 'offence',
  optimize: 'optimise',
  optimized: 'optimised',
  organization: 'organisation',
  organizations: 'organisations',
  organize: 'organise',
  organized: 'organised',
  panelist: 'panellist',
  panelists: 'panellists',
  personalize: 'personalise',
  prioritize: 'prioritise',
  prioritized: 'prioritised',
  realize: 'realise',
  realized: 'realised',
  recognize: 'recognise',
  recognized: 'recognised',
  rigor: 'rigour',
  specialize: 'specialise',
  standardize: 'standardise',
  summarize: 'summarise',
  summarized: 'summarised',
  synchronize: 'synchronise',
  synchronized: 'synchronised',
  synthesize: 'synthesise',
  synthesized: 'synthesised',
  traveled: 'travelled',
  traveling: 'travelling',
  utilize: 'utilise',
  visualize: 'visualise',
};

// Core British English + Product / UX Research / Compliance vocabulary (~1,250 root words)
const RAW_DICTIONARY = `
a able about above accept access account accurate achieve across act action active activity actual actually add added adding addition additional address admin adopt advance advantage advice advise after again against age agency agent ago agree agreement ahead aid aim air alert align all allow almost alone along already also alter alternative although always am among amount analyse analysed analysing analysis analyst analytics and angle announce annual another answer any anyone anything anyway anywhere apart api app appear apple application apply approach approve april area argue argument around arrange arrive art artefact article as ask aspect assess asset assign assignee assist assistant assume assumption assure at attach attack attempt attend attention attitude attract audience audio audit auditor august author authorise authorised authorisation authority auto automate automated automatic automation available average avoid await aware away
back background backlog backup bad balance band bank banking bar bare base basic basis batch be bear beat became because become bed been before began begin beginning behalf behaviour behavioural behind being belief believe belong below bench benchmark beneath benefit beside best bet better between beyond bias biased big bill billing binary biometric bit black blank block blog blue blur board body bold book booking boolean border both bottom bought bound boundary box branch brand break brief bright bring broad broke broken browser bucket budget bug build builder building built bulk bullet bunch bundle burden burn business busy but button buy buyer by byo
cache cadence calendar call calm came campaign can cancel cancelled cancelling candidate cannot cap capability capable capacity capital capture card care career careful carry case cash cast cat catch catalogue categorise category cause caution centre centred central century certain certainly chain chair challenge chance change channel chapter character charge chart check checkout checkpoint chief child choice choose chose chosen chrome chunk circle cite citizen city claim clarity class clean clear clearly click client clinical clip clock close closed closely cloud cluster coach code cohort collaborate collaboration collaborator collapse collect collection colour column combine come comfort coming command comment commercial commit common communicate communication community company compare comparison compete competition competitor complain complaint complete completed completely completion compliance compliant component compose composer comprehend comprehension comprehensive compute computer concept concern conclude conclusion concrete condition conduct conference confidence confident confirm confirmation conflict confuse confusing confusion connect connected connection consent consider consideration consistent console constant constraint construct consult consultant consumer contact contain container content context continue continuous contract contrast contribute contribution control convert conversion cookie cool copy core corner corporate correct correction cost could council count counter country couple course court cover coverage create creation creative creator credit criteria critical critique cross crowd crucial cryptographic csv cue culture curious current currently cursor custom customise customised customer cut cycle
daily damage danger dark data database date day dead deal dear debate debug decade december decide decision deck declare decline decrease dedicate dedicated deep default defeat defend defence defer define definitely definition degree delay delegate delete deliberate deliver deliverable delivery delta demand demo democratise demographic demonstrate denial deny department depend dependent deploy deployment depth describe description design designer desire desk desktop detail detailed detect detection determine dev develop developer development device diagram dialog dialogue did differ difference different difficult difficulty digest digital dimension direct direction directly director directory disable disagree disappear disappoint discipline discover discovery discuss discussion display distance distinct distribute distribution district disturb dive diverse diversity divide divider division do doc docs document documentation does dog domain done door double doubt down download draft drag draw dream dress drill drive driver drop dropdown drove dry due dummy duplicate during duty dynamic
each eager early earn earth ease easily east easy eat edge edit edition editor educate education effect effective effectively efficiency efficient effort ehr eight either elaborate elect element elevate elevation eliminate else email embed emerge emotion emotional emphasis emphasize emphasise employ employee employer empty enable encode encounter encourage end endorse enforce engage engagement engine engineer engineering enhance enjoy enormous enough enrol enrolment ensure enter enterprise entire entirely entity entry environment equal equip equipment equivalent era error escape especially essential establish estimate etc ethical eu evaluate evaluation even evening event eventually ever every everybody everyone everything everywhere evidence evident exact exactly examine example exceed excel excellent except exception exchange excite exclude exclusive execute execution executive exercise exhaust exhibit exist existence existing exit expand expect expectation expense expensive experience experiment expert explain explanation explicit explore export expose exposure express extend extension extensive extent external extra extract extreme eye
face facilitate facility fact factor fail failure fair fairly faith fall false familiar family famous fan far farm fast fatal father fault favour favourite fca fear feature february fed federal fee feed feedback feel feeling felt few field fieldwork fifteen fifth fifty figma fight figure file fill film filter final finalise finalised finally finance financial find finding fine finger finish fintech fire firebase firestore firm first fit five fix fixed flag flat flex flexible flight flip float floor flow fluid focus fold folder follow following font food foot for force forecast foreign forever forget form formal format former formula forth forward found foundation four fourth frame framework free freedom freeze frequency frequent frequently fresh friction friday friend friendly from front frustrate frustrating frustration fulfil fulfilment full fully fun function functional fund fundamental funny further future
gain game gap gate gather gave gdpr gear general generally generate generation generic gentle get giant gift give given glad glass global glossary go goal goes gold gone good got govern governance government grab grade gradient grant graph graphic grasp great greatly green grew grey grid grip ground group grow growth guarantee guard guardrail guess guest guide guideline guided guidelines guilty guy
habit had half hall hand handful handle handoff hang happen happy hard hardly harm hash has hate have having he head header headline health healthcare healthy hear heard heart heat heatmap heavy height held hello help helpful hence her here herself hesitate hesitation hidden hide high highlight highly him himself hint hipaa hire his history hit hold holder hole holiday home honest honour hook hope horizon horizontal host hot hour house how however huge human humble hundred hung hurry hurt hypothesis hypothetical
iban icon idea ideal identify identity idle if ignore ill illegal illustrate image imagine immediate immediately impact implement implementation implication imply import importance important impose impossible impress impression improve improvement in in-buffer in-browser incentive incident include including income incoming increase indeed independent index indicate indicator individual industrial industry inevitable info infosec inform information infrastructure ingest ingestion initial initially initiate inject inline inner input inquiry insert inside insight inspect install instance instant instead institute institution instruct instruction instrument insurance insurtech intact integrate integration integrity intellect intelligence intelligent intend intense intent interact interaction interactive intercept interest interface internal international internet interpret interrupt interval interview interviewer into introduce introduction invalid invariant inventory invest investigate investigation invite invoice involve ios ip is island isolate isolation issue it item its itself
january jargon java javascript jira job join joint journey joy judge judgement july jump june junior just justice justify
keep kept key keyboard kick kid kill kind king kit kitchen knew know knowledge known kyc
label labelled labelling lab labour laboratory lack ladder lady laid lake land landing language large largely last late later latest latter laugh launch law lawyer lay layer layout lazy lead leader leadership leading leaf league lean learn learning learnt least leave led left legal legibility legible lend length less lesson let letter level leverage liability library licence license lie life lift light like likely limit limitation line linear link linkedin list listen listing literal literally little live load local locate location lock log logic logical login logo logout lone long look lookup loop loose lose loss lost lot loud love low lower loyal luck lucky lunch luxury
machine mad made magic mail main mainly maintain maintenance major majority make maker making male man manage management manager mandate mandatory manner manual manually many map margin mark markdown market marketing marketplace mask masking mass massive master match material math matrix matter mature max maximise maximum may maybe maze me meal mean meaning means meant meanwhile measure mechanism media median medical medicine medium meet meeting member membership memory mental mention menu merely merge merit mesh mess message metadata metal method methodology metric micro mid middle might migrate migration mild mile military million mind mine minimal minimise minimum minor minority minute mirror miss missing mission mistake mix mixed mobile mock mockup mode model modelled modelling moderate moderated moderation moderator modern modify modular module moment monday money monitor month monthly mood moral more moreover morning most mostly mother motion motivate motivation motor mount mouse mouth move movement movie much multi multimodal multiple multiply must mute mutual my myself
nail name narrative narrow nation national native natural nature navigate navigation near nearby nearly neat necessary neck need negative neglect negotiate neighbour neither nerve nest net network neutral neutralise neutralised neutrality never nevertheless new newly news next nhs nice niche night nine no nobody nod noise nominal none nonetheless noon nor norm normal normally north not notable note nothing notice notify notion novel november now nowhere null number numeric numerous nurse
oak obey object objective obligation observe observer obtain obvious obviously occasion occasional occupy occur ocean october odd of off offence offer office officer official often oh oil ok okay old omit on onboarding once one ongoing online only onto open operate operating operation operational operator opinion opponent opportunity oppose opposite opt optical optimal optimise optimised option optional or oral orange order ordinary org organisation organise organised origin original originally orphan other otherwise ought our ours ourselves out outcome outdoor outer outfit outline output outside overall overcome overflow overhead overlap overlay overlook override own owner ownership
pace pack package packet pad page paid pain painful paint pair panel panellist paper parallel parameter parent park part partial partially participate participant participation particular particularly partner partnership party pass passage passenger passive password past paste pat patch path patience patient pattern pause pay payout payment peace peak peer pen penalty pending people per perceive percent percentage perception perfect perfectly perform performance perhaps period permanent permission permit persist persistence person personal personalise personality personally perspective persuade phase phone photo photograph phrase physical pick picker picture piece pile pill pilot pin pink pioneer pipe pipeline pitch pixel place plain plan plane planet planner planning plant plastic plate platform play player please pleasure plenty plot plug plus pm pocket point policy polish polite political poll pool poor pop popular population popup port portal portfolio portion portrait pose position positive possess possible possibly post poster potential potentially pound pour power powerful practical practice practise practitioner praise pray pre precision predict prefer preference prefix pregnancy premise premium prepare presence present presentation preserve press pressure presume pretty prevent previous previously price pricing pride primary primarily prime priming primitive principal principle print prior priority prioritise prioritised privacy private privilege prize pro probable probably probe probing problem procedure proceed process produce producer product production productive productivity profession professional profile profit program programme progress project prolific prominent promise promote promotion prompt proof proper properly property proportion proposal propose proration prospect protect protection protest protocol prototype proud prove provide provider province provision proxy public publication publish pull pulse pump punch purchase pure purely purple purpose push put puzzle
qualitative quality quantify quantitative quarter query question questionnaire queue quick quickly quiet quit quite quota quote
race radar radio radius rail rain raise ran random range rank rapid rapidly rare rarely rate rather ratio rational raw reach react reaction read readable reader readiness reading ready real realise realistic reality really realm rear reason reasonable recall receipt receive recent recently recipe recognise recommend recommendation record recording recover recovery recruit recruiting recruitment red redact redaction redesign reduce reduction redundant refer reference refine reflect reform refresh refuse regard regardless regime region regional register registration regret regular regularly regulate regulated regulation reject relate relation relationship relative relatively relax release relevant reliability reliable relief rely remain remark remarkable remember remind remote remove rename render renew rent repair repeat replace reply report repository represent representative request require requirement research researcher reserve reside residency resident resign resist resistance resolution resolve resource respect respond respondent response responsibility responsible rest restore restrain restraint restrict restriction result resume retail retain retention retire return reveal revenue reverse review revise revision revoke reward rewrite rhythm rich rid ride right rigid rigour rigorous ring rise risk rival road roadmap robust rock role roll roof room root rope rough roughly round route routine row rub rubber rubric rude rule run runner running rural rush
saas sad safe safely safety said sail sake salary sale sales salt same sample saml sandbox sang sans sat satisfy saturday save saving saw say scale scan scare scenario scene schedule schema scheme scholar school science scientific scim scope score scoreboard scratch screen screener screenshot script scrub sea seal search season seat second secondary secret section sector secure security see seed seek seem seen segment select selection self sell seller semantic send senior sense sensible sensitive sensitivity sent sentence separate separation september sequence series serious seriously serve server service session set setting settle seven several severe severity shadow shake shall shallow shame shape share shared shareholder sharp she sheet shelf shell shelter shift shine ship shirt shock shoe shoot shop shopping short shortcut shortlist shortly shot should shoulder shout show showcase shown shrink shut shuttle shy side sidebar sigh sight sign signal signalled signature significance significant silence silent silk silly silver similar similarly simple simplify simply simulate simulation simultaneous since sing single sink sir sister sit site situation six size sketch skill skin skip sky slack slap slave sleep sleeve slice slide slight slightly slim slip slope slot slow slowly small smart smell smile smoke smooth snap snapshot snow so soak soap soc social society sock soft software soil solar sold soldier sole solely solid solution solve some somebody somehow someone something sometimes somewhat somewhere son song soon sophisticated sorry sort soul sound source sourcing south sovereign sovereignty space span spare spark spatial speak speaker special specialise specialist specific specifically specification specify specimen speech speed spell spelling spelt spend spent sphere spin spirit split spoke sponsor spot spread spring sprint squad square squeeze stability stable stack staff stage stair stake stakeholder stamp stand standard standardise star stare start starter startup state statement static station statistic statistical status stay steady steal steam steel steep steer stem step stereo stick sticky stiff still stimulus stir stock stomach stone stood stop storage store storm story straight strain strand strange stranger strategic strategy straw stream street strength stress stretch strict strictly strike string strip stripe strive stroke strong strongly structure struggle stuck student studio study stuff stumble style sub subject submit subscribe subscription subsequent subset substance substantial substitute subtle succeed success successful successfully such sudden suddenly suffer sufficient sugar suggest suggestion suit suitable suite sum summarise summary summer summit sun sunday super superior supervise supply support suppose suppress sure surely surface surge surplus surprise surround survey survive suspect suspend sustain swallow swear sweat sweep sweet swim swing switch symbol sympathy symptom sync synchronise synchronised synchronous syntax synthesis synthesise synthesised system systematic
tab table tablet tabular tackle tag tail tailor take taken tale talent talk tall tank tap tape target task taste tax taxonomy tea teach teacher team teammate tear tech technical technique technology tedious teen telemetry telephone tell temperature template temporary ten tend tendency tender tense tension tent term terminal terms terrible territory test testing text texture than thank that the theatre their them theme themselves then theory therapy there therefore thermal these they thick thin thing think third thirsty thirteen thirty this thorough those though thought thousand thread threat three threshold threw through throughout throw thru thumb thursday thus tick ticket tide tidy tie tier tight tile till tilt time timeline timer timestamp timing tiny tip tire tired title to today toe together toggle token told tolerate toll tomorrow ton tone tongue tonight too took tool toolbar tooling tooltip tooth top topic torch total totally touch tough tour toward towards tower town trace track tracker tracking trade tradition traffic trail train training trait transaction transcript transfer transform transition translate transmission transmit transparency transparent transport trap trash travel travelled travelling tray treat treatment treasury tree trend trial triangle tribe trick trigger trim trip triumph trivial troop trophy trouble truck true truly trust truth try tuesday tug tumble tune tunnel turn turnaround twelve twenty twice twin twist two type typical typically typography
ugly ui ultimate ultimately unable unaware unauthorised uncertain uncle uncover under undergo underlying understand understanding undertake undo uneasy unexpected unfair unfold unfortunately unhappy uniform union unique unit unite unity universal universe university unknown unless unlike unlikely unlimited unlock unnecessary unpack unpleasant unredacted unrelated unsafe unsigned unstable until unusual unwind up upcoming update upgrade uphold upon upper upright upset upside upstairs upward urban urge urgent us usability usable usage use used useful user usual usually utility utilise ux uxr
vacant vacation vacuum vague valid validate validation validity valley valuable value van vanish vanity variable variant variation variety various vary vast vault vector vehicle vendor venture venue verbal verify verification version versus vertical very vessel vet veteran via viable vibrant vice victim victory video view viewer viewport vigour village violate violation viral virtual virtue virus visible vision visit visitor visual visualise vital vivid vocabulary vocal voice void volume voluntary volunteer vote vow
wage wait wake walk walkthrough wall wallet wander want war ward warm warn warning warrant was wash waste watch water wave way wayfinding we weak weakness wealth weapon wear weather web webcam webrtc website wednesday week weekly weigh weight weird welcome welfare well went were west western wet what whatever wheel when whenever where whereas whereby wherever whether which while whilst whip whisper white who whoever whole whom whose why wide widely width wife wild will willing win wind window wine wing winner winter wipe wire wisdom wise wish wit with withdraw within without witness woke woman women won wonder wonderful wood wooden word work workbench worker workflow working workout workspace world worn worry worse worst worth worthy would wound wrap wrath wreck write writer writing written wrong wrote
yard yeah year yearly yell yellow yes yesterday yet yield you young your yours yourself youth
zero zone zoom
`;

const DICTIONARY_SET: Set<string> = new Set(
  RAW_DICTIONARY.split(/\s+/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean)
);

// Include every target value from COMMON_TYPOS in the dictionary set as well
Object.values(COMMON_TYPOS).forEach((word) => {
  const clean = word.replace(/'/g, '').toLowerCase();
  if (clean) DICTIONARY_SET.add(clean);
});

const DICTIONARY_LIST = Array.from(DICTIONARY_SET);

function isKnownWord(rawWord: string): boolean {
  const lower = rawWord.toLowerCase();
  if (lower.length <= 2) return true;
  if (/^\d+$/.test(lower)) return true;
  // Skip ALL-CAPS acronyms (e.g. GDPR, FCA, HIPAA, IBAN, KYC, UX, UI, SSO, UK, EU)
  if (/^[A-Z]{2,}$/.test(rawWord)) return true;

  if (DICTIONARY_SET.has(lower)) return true;

  // Handle common English contractions
  const apostropheStripped = lower.replace(/('s|'t|'re|'ve|'ll|'d|'m|n't)$/, '');
  if (apostropheStripped !== lower && DICTIONARY_SET.has(apostropheStripped)) return true;

  // Handle hyphenated compounds (e.g. "first-click", "open-ended", "client-side")
  if (lower.includes('-')) {
    const parts = lower.split('-').filter(Boolean);
    if (parts.length > 1 && parts.every((p) => isKnownWord(p))) return true;
  }

  // Common regular English inflection suffixes
  const stemCandidates: string[] = [];
  if (lower.endsWith('ies') && lower.length > 4) {
    stemCandidates.push(`${lower.slice(0, -3)}y`);
  }
  if (lower.endsWith('ied') && lower.length > 4) {
    stemCandidates.push(`${lower.slice(0, -3)}y`);
  }
  if (lower.endsWith('es') && lower.length > 3) {
    stemCandidates.push(lower.slice(0, -2), lower.slice(0, -1));
  }
  if (lower.endsWith('s') && lower.length > 3) {
    stemCandidates.push(lower.slice(0, -1));
  }
  if (lower.endsWith('ing') && lower.length > 5) {
    const base = lower.slice(0, -3);
    stemCandidates.push(base, `${base}e`);
    if (base.length > 2 && base[base.length - 1] === base[base.length - 2]) {
      stemCandidates.push(base.slice(0, -1));
    }
  }
  if (lower.endsWith('ed') && lower.length > 4) {
    const base = lower.slice(0, -2);
    stemCandidates.push(base, `${base}e`, lower.slice(0, -1));
    if (base.length > 2 && base[base.length - 1] === base[base.length - 2]) {
      stemCandidates.push(base.slice(0, -1));
    }
  }
  if (lower.endsWith('er') && lower.length > 4) {
    const base = lower.slice(0, -2);
    stemCandidates.push(base, `${base}e`, lower.slice(0, -1));
  }
  if (lower.endsWith('est') && lower.length > 5) {
    const base = lower.slice(0, -3);
    stemCandidates.push(base, `${base}e`);
  }
  if (lower.endsWith('ly') && lower.length > 4) {
    const base = lower.slice(0, -2);
    stemCandidates.push(base, `${base}e`);
    if (base.endsWith('i')) stemCandidates.push(`${base.slice(0, -1)}y`);
  }
  if (lower.endsWith('ness') && lower.length > 6) {
    const base = lower.slice(0, -4);
    stemCandidates.push(base, base.endsWith('i') ? `${base.slice(0, -1)}y` : base);
  }
  if (lower.endsWith('ment') && lower.length > 6) {
    stemCandidates.push(lower.slice(0, -4));
  }
  if (lower.endsWith('able') && lower.length > 6) {
    const base = lower.slice(0, -4);
    stemCandidates.push(base, `${base}e`);
  }

  for (const stem of stemCandidates) {
    if (DICTIONARY_SET.has(stem)) return true;
  }

  return false;
}

// Optimal String Alignment (Damerau-Levenshtein) distance with fast length pruning
function damerauLevenshtein(a: string, b: string, maxDist = 2): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > maxDist) return maxDist + 1;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    let rowMin = maxDist + 1;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, dp[i - 2][j - 2] + 1);
      }
      dp[i][j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > maxDist) return maxDist + 1;
  }

  return dp[m][n];
}

function matchCasing(source: string, replacement: string): string {
  if (source === source.toUpperCase() && source.length > 1) {
    return replacement.toUpperCase();
  }
  if (source[0] === source[0].toUpperCase() && source[0] !== source[0].toLowerCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

export function getSpellingSuggestion(
  rawWord: string
): { suggestion: string; suggestions: string[]; highConfidence: boolean } | null {
  const lower = rawWord.toLowerCase();

  // Check explicit typo dictionary first
  if (COMMON_TYPOS[lower]) {
    const corrected = matchCasing(rawWord, COMMON_TYPOS[lower]);
    return {
      suggestion: corrected,
      suggestions: [corrected],
      highConfidence: true,
    };
  }

  if (isKnownWord(rawWord)) return null;

  // Skip words that look like proper names (capitalized mid-sentence) only if no distance-1 match
  const maxAllowed = lower.length <= 4 ? 1 : 2;
  const scored: { word: string; dist: number; prefixMatch: boolean }[] = [];

  for (const candidate of DICTIONARY_LIST) {
    const dist = damerauLevenshtein(lower, candidate, maxAllowed);
    if (dist <= maxAllowed) {
      scored.push({
        word: candidate,
        dist,
        prefixMatch: candidate[0] === lower[0],
      });
    }
  }

  if (scored.length === 0) return null;

  scored.sort((a, b) => {
    if (a.dist !== b.dist) return a.dist - b.dist;
    if (a.prefixMatch !== b.prefixMatch) return a.prefixMatch ? -1 : 1;
    return Math.abs(a.word.length - lower.length) - Math.abs(b.word.length - lower.length);
  });

  const best = scored[0];
  const topSuggestions = scored.slice(0, 3).map((s) => matchCasing(rawWord, s.word));

  return {
    suggestion: topSuggestions[0],
    suggestions: topSuggestions,
    highConfidence: best.dist === 1 && best.prefixMatch,
  };
}

export function findSpellingIssues(
  text: string,
  ignoredWords?: ReadonlySet<string>
): SpellingIssue[] {
  const issues: SpellingIssue[] = [];
  const wordRegex = /\b[A-Za-z][A-Za-z'-]*[A-Za-z]\b/g;
  let match: RegExpExecArray | null;

  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0];
    if (ignoredWords?.has(word.toLowerCase())) continue;

    // Avoid false flagging intentional proper nouns unless in COMMON_TYPOS
    const start = match.index;
    const isSentenceStart =
      start === 0 || /[.!?\n]\s*$/.test(text.slice(Math.max(0, start - 3), start));
    const isCapitalized = word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase();

    const suggestion = getSpellingSuggestion(word);
    if (!suggestion) continue;

    // If capitalized mid-sentence and not a known typo or dist-1 hit, assume proper noun
    if (isCapitalized && !isSentenceStart && !COMMON_TYPOS[word.toLowerCase()] && !suggestion.highConfidence) {
      continue;
    }

    issues.push({
      start,
      end: start + word.length,
      word,
      suggestion: suggestion.suggestion,
      suggestions: suggestion.suggestions,
      highConfidence: suggestion.highConfidence,
    });
  }

  return issues;
}

/**
 * Checks if the user just finished a word by typing a boundary character
 * (space, newline, or punctuation) at cursorPos and auto-corrects high-confidence typos.
 */
export function autoCorrectAtBoundary(
  nextText: string,
  cursorPos: number,
  ignoredWords?: ReadonlySet<string>
): AutoCorrectResult {
  if (cursorPos < 2) return { text: nextText, cursorPos };

  const charJustTyped = nextText[cursorPos - 1];
  if (!/[\s.,?!;:]/.test(charJustTyped)) {
    return { text: nextText, cursorPos };
  }

  // Extract the word immediately preceding the boundary character
  const beforeBoundary = nextText.slice(0, cursorPos - 1);
  const wordMatch = beforeBoundary.match(/([A-Za-z][A-Za-z'-]*[A-Za-z])$/);
  if (!wordMatch) return { text: nextText, cursorPos };

  const word = wordMatch[1];
  if (ignoredWords?.has(word.toLowerCase())) {
    return { text: nextText, cursorPos };
  }

  const found = getSpellingSuggestion(word);
  if (!found || !found.highConfidence || found.suggestion === word) {
    return { text: nextText, cursorPos };
  }

  const wordStart = cursorPos - 1 - word.length;
  const replacedText =
    nextText.slice(0, wordStart) + found.suggestion + nextText.slice(cursorPos - 1);
  const delta = found.suggestion.length - word.length;

  return {
    text: replacedText,
    cursorPos: cursorPos + delta,
    corrected: {
      from: word,
      to: found.suggestion,
      start: wordStart,
    },
  };
}

/**
 * Auto-corrects a trailing high-confidence misspelled word when the user leaves the field (onBlur).
 */
export function autoCorrectTrailingWord(
  text: string,
  ignoredWords?: ReadonlySet<string>
): AutoCorrectResult {
  const wordMatch = text.match(/([A-Za-z][A-Za-z'-]*[A-Za-z])$/);
  if (!wordMatch) return { text, cursorPos: text.length };

  const word = wordMatch[1];
  if (ignoredWords?.has(word.toLowerCase())) {
    return { text, cursorPos: text.length };
  }

  const found = getSpellingSuggestion(word);
  if (!found || !found.highConfidence || found.suggestion === word) {
    return { text, cursorPos: text.length };
  }

  const wordStart = text.length - word.length;
  const replacedText = text.slice(0, wordStart) + found.suggestion;

  return {
    text: replacedText,
    cursorPos: replacedText.length,
    corrected: {
      from: word,
      to: found.suggestion,
      start: wordStart,
    },
  };
}
