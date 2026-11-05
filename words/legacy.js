// words.js - 단어 데이터베이스

const WORD_SETS = {
  // 첫 번째 단어장
  superintelligence: {
    name: "Superintelligence",
    words: [
      { term: "existentialism", meaning: ["실존주의"], synonyms: [] },
      { term: "bring about", meaning: ["유발하다"], synonyms: ["cause"] },
      { term: "catastrophe", meaning: ["위기", "비극"], synonyms: ["crisis"] },
      { term: "contend", meaning: ["주장하다"], synonyms: ["argue"] },
      { term: "mutual", meaning: ["공동의"], synonyms: ["common"] },
      { term: "vulnerability", meaning: ["취약성"], synonyms: [] },
      { term: "constitute", meaning: ["구성하다"], synonyms: [] },
      { term: "seminal", meaning: ["영향력 있는"], synonyms: ["strongly influential"] },
      { term: "disseminate", meaning: ["생각을 퍼뜨리다"], synonyms: [] },
      { term: "concede", meaning: ["인정하다"], synonyms: ["admit", "agree"] },
      { term: "emergence", meaning: ["등장", "창발"], synonyms: [] },
      { term: "emergency", meaning: ["비상"], synonyms: [] },
      { term: "salient", meaning: ["현저한", "중요한"], synonyms: ["prominent"] },
      { term: "saliency", meaning: ["현저성"], synonyms: [] },
      { term: "indifferent", meaning: ["무관심한"], synonyms: ["unconcerned"] },
      { term: "obsolete", meaning: ["쓸모없는", "쓸데없는"], synonyms: ["out of date", "useless"] },
      { term: "obsolescence", meaning: ["노후화"], synonyms: [] },
      { term: "obliterate", meaning: ["지우다"], synonyms: ["erase"] },
      { term: "malice", meaning: ["악의"], synonyms: [] },
      { term: "corroborate", meaning: ["확증하다"], synonyms: ["support"] },
      { term: "aspiration", meaning: ["포부"], synonyms: [] },
      { term: "inadvertently", meaning: ["실수로", "우연히"], synonyms: ["accidentally"] },
      { term: "futile", meaning: ["쓸모없는", "쓸데없는"], synonyms: ["of no use", "in vain"] },
      { term: "surreptitiously", meaning: ["은밀하게"], synonyms: ["secretly"] },
      { term: "immortality", meaning: ["불멸성"], synonyms: [] },
      { term: "nascent", meaning: ["초기의"], synonyms: ["a young", "budding", "beginning"] },
      { term: "hubris", meaning: ["거만"], synonyms: ["arrogance"] },
      { term: "refute", meaning: ["반박하다"], synonyms: ["disprove"] },
      { term: "refutation", meaning: ["논박"], synonyms: [] },
      { term: "reputation", meaning: ["명성"], synonyms: [] },
      { term: "implausible", meaning: ["믿을 수 없는"], synonyms: ["unlikely"] },
      { term: "anthropomorphosis", meaning: ["의인화"], synonyms: [] },
      { term: "admonition", meaning: ["훈계", "비판"], synonyms: ["criticism", "advice"] },
      { term: "premise", meaning: ["전제"], synonyms: [] },
      { term: "be at odds with", meaning: ["~와 대립하다"], synonyms: [] },
      { term: "normativity", meaning: ["최고선", "규범"], synonyms: [] },
      { term: "consensus", meaning: ["동의"], synonyms: ["agreement"] },
      { term: "arbitrary", meaning: ["자의적인"], synonyms: [] },
      { term: "momentous", meaning: ["중요한"], synonyms: ["significant", "important"] },
      { term: "inscrutable", meaning: ["신비한"], synonyms: ["mysterious"] },
      { term: "conductive", meaning: ["기여하다"], synonyms: ["good for"] },
      { term: "accede", meaning: ["인정하다"], synonyms: ["agree"] },
      { term: "rejoice", meaning: ["기뻐하다"], synonyms: ["feel joy"] },
      { term: "supersede", meaning: ["대체하다"], synonyms: ["replace"] },
      { term: "preeminence", meaning: ["탁월함"], synonyms: ["excellence"] },
      { term: "progeny", meaning: ["후손"], synonyms: ["offspring"] }
    ]
  },
  
  // 두 번째 단어장
  robotdog: {
    name: "Robot Dog",
    words: [
      { term: "free will", meaning: ["자유의지"], synonyms: [] },
      { term: "sentient", meaning: ["자의식이 있는"], synonyms: [] },
      { term: "dystopia", meaning: ["디스토피아", "역유토피아"], synonyms: [] },
      { term: "utopia", meaning: ["유토피아", "이상향"], synonyms: [] },
      { term: "anthology", meaning: ["선집"], synonyms: ["published collection"] },
      { term: "nascent", meaning: ["초기의"], synonyms: ["beginning", "budding", "young"] },
      { term: "absurd", meaning: ["부조리한"], synonyms: [] },
      { term: "absurdity", meaning: ["부조리"], synonyms: [] },
      { term: "surveillance", meaning: ["감시"], synonyms: [] },
      { term: "run rampant", meaning: ["만연하다"], synonyms: ["spread unrestrained"] },
      { term: "disorienting", meaning: ["갈피를 못잡게 만드는"], synonyms: [] },
      { term: "alteration", meaning: ["변화"], synonyms: ["change"] },
      { term: "altercation", meaning: ["언쟁", "격론"], synonyms: [] },
      { term: "fickleness", meaning: ["변덕스러움"], synonyms: [] },
      { term: "per usual", meaning: ["예전과 마찬가지로"], synonyms: [] },
      { term: "refer to A as B", meaning: ["A를 B라 칭하다"], synonyms: [] },
      { term: "entity", meaning: ["실체", "존재"], synonyms: [] },
      { term: "postapocalyptic", meaning: ["종말 이후의"], synonyms: ["after the doomsday"] },
      { term: "malfunction", meaning: ["오작동"], synonyms: [] },
      { term: "sophisticated", meaning: ["진화된"], synonyms: ["advanced", "elaborate", "highly developed"] },
      { term: "outsmart", meaning: ["지혜로 이기다"], synonyms: ["defeat by being clever"] },
      { term: "stunning", meaning: ["굉장히 멋진"], synonyms: ["remarkable", "extraordinary"] },
      { term: "ingenuity", meaning: ["창의성"], synonyms: ["creativity"] },
      { term: "relentless", meaning: ["잔인한"], synonyms: ["continuously harsh"] },
      { term: "fierce", meaning: ["사나운"], synonyms: ["wild", "aggressive"] },
      { term: "backlash", meaning: ["반발"], synonyms: ["a strong negative reaction"] },
      { term: "ensue", meaning: ["뒤따르다"], synonyms: ["follow"] },
      { term: "precarious", meaning: ["불확실한"], synonyms: ["uncertain", "insecure"] },
      { term: "allegory", meaning: ["비유", "풍유", "우의적 표현"], synonyms: ["symbol", "metaphor"] },
      { term: "monopoly", meaning: ["독점"], synonyms: [] }
    ]
  }
  
  // 세 번째 단어장
  // "3dprint": {
  //   name: "3D Print",
  //   words: [
  //     { term: "International Space Station", meaning: ["국제우주정거장"], synonyms: [] },
  //     { term: "habitat", meaning: ["서식지"], synonyms: [] },
  //     { term: "on-demand", meaning: ["요구 즉시"], synonyms: [] },
  //     { term: "reliance", meaning: ["신뢰"], synonyms: ["dependence"] },
  //     { term: "reliability", meaning: ["신뢰도"], synonyms: [] },
  //     { term: "regolith", meaning: ["표토"], synonyms: ["surface dust"] },
  //     { term: "outpost", meaning: ["전초기지"], synonyms: [] },
  //     { term: "infrastructure", meaning: ["기간 시설"], synonyms: [] },
  //     { term: "cost-effective", meaning: ["가성비 높은"], synonyms: [] },
  //     { term: "despite", meaning: ["그럼에도 불구하고"], synonyms: ["in spite of"] },
  //     { term: "withstand", meaning: ["견디다", "버티다"], synonyms: ["put up with", "endure", "resist"] },
  //     { term: "durability", meaning: ["내구성"], synonyms: [] },
  //     { term: "ground-breaking", meaning: ["획기적인"], synonyms: ["innovative"] },
  //     { term: "additive", meaning: ["누적의"], synonyms: [] },
  //     { term: "additive manufacturing", meaning: ["3D 프린팅"], synonyms: ["3D printing"] },
  //     { term: "be known as", meaning: ["~로서 알려져있다"], synonyms: [] },
  //     { term: "be known for", meaning: ["~로 유명하다"], synonyms: [] },
  //     { term: "be known to", meaning: ["~에게 알려져있다"], synonyms: [] },
  //     { term: "maintenance", meaning: ["유지", "보수"], synonyms: [] },
  //     { term: "on the spot", meaning: ["그자리에서"], synonyms: ["without any delay", "at the scene"] },
  //     { term: "address", meaning: ["연설하다", "주소를 기입하다", "다루다"], synonyms: [] },
  //     { term: "microgravity", meaning: ["저중력"], synonyms: [] },
  //     { term: "maritime", meaning: ["해양"], synonyms: ["naval"] },
  //     { term: "a maritime law", meaning: ["해상법"], synonyms: [] },
  //     { term: "dispose of", meaning: ["처분하다"], synonyms: [] },
  //     { term: "feedstock", meaning: ["원료"], synonyms: ["raw material"] },
  //     { term: "synthesize", meaning: ["합성하다"], synonyms: [] },
  //     { term: "pharmaceuticals", meaning: ["약제", "제약"], synonyms: [] }
  //   ]
  // }
};

function expandAnswers(answer) {
  const results = [answer.trim()];
  const noParen = answer.replace(/\(.*?\)/g, "").trim();
  if (noParen !== answer) results.push(noParen);
  const keepInside = answer.replace(/[()]/g, "").trim();
  if (keepInside !== answer) results.push(keepInside);
  return [...new Set(results)];
}
