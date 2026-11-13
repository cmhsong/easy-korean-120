/* 도트 그림 모음 (12×12). 글에 나오는 낱말(k)에 맞춰 app.js가 자동으로 골라 보여 준다.
   색 글자: . 투명  k 검정  w 하양  r 빨강  o 주황  y 노랑  g 연두  G 초록  b 파랑  B 남색
            s 살구  n 갈색  p 분홍  v 보라  e 회색  c 하늘 */
(function () {
  var face = [
    '....yyyy....', '..yyyyyyyy..', '.yyyyyyyyyy.', '.yyyyyyyyyy.', 'yyykyyyykyyy', 'yyykyyyykyyy',
    'yyyyyyyyyyyy', 'yyyyyyyyyyyy', '.yykyyyykyy.', '.yyykkkkyyy.', '..yyyyyyyy..', '....yyyy....'
  ];
  function vary(rows, color) {
    var d = face.slice(), k;
    for (k in rows) d[k] = rows[k];
    if (color) d = d.map(function (r) { return r.replace(/y/g, color); });
    return d;
  }
  window.PIXART = {
    pal: { k: '#1F2937', w: '#FFFFFF', r: '#E5484D', o: '#F5892B', y: '#FFD23F', g: '#7BC65B', G: '#2E8B57', b: '#3B82F6',
      B: '#1E3A8A', s: '#F3C79A', n: '#8B5A2B', p: '#F48FB1', v: '#8B5CF6', e: '#9CA3AF', c: '#9BD8F5' },
    art: {
      sun: { n: '해', k: ['해가', '해님', '햇볕', '햇살', '햇빛', '맑음', '맑은', '여름', '더웠', '덥다', '낮에', '아침'], d: [
        '.....yy.....', '.y...yy...y.', '..y......y..', '....oooo....', '...oyyyyo...', 'yy.oyyyyo.yy',
        'yy.oyyyyo.yy', '...oyyyyo...', '....oooo....', '..y......y..', '.y...yy...y.', '.....yy.....'] },
      rain: { n: '비', k: ['비가', '빗방울', '빗소리', '소나기', '먹구름', '장마', '봄비', '비 오는', '비를'], d: [
        '............', '....eee.....', '...eeeee.ee.', '..eeeeeeeeee', '.eeeeeeeeeee', '.eeeeeeeeeee',
        '..eeeeeeeee.', '............', '..b..b..b...', '.b..b..b....', '............', '..b..b..b...'] },
      umbrella: { n: '우산', k: ['우산', '양산'], d: [
        '.....k......', '...rrrrr....', '..rrrrrrr...', '.rrrrrrrrr..', 'rrrrrrrrrrr.', 'r..r.k.r..r.',
        '.....k......', '.....k......', '.....k......', '.....k......', '.....k..k...', '......kk....'] },
      snowman: { n: '눈사람', k: ['눈사람', '눈이 내', '눈이 와', '눈이 많이', '함박눈', '눈송이', '겨울', '하얀 눈', '눈 오는', '추운', '추웠'], d: [
        '....kkkk....', '....kkkk....', '...kkkkkk...', '....wwww....', '...wkwwkw...', '...wwooww...',
        '....wwww....', '...rrrrrr...', '..wwwwwwww..', '..wwwkwwww..', '..wwwkwwww..', '...wwwwww...'] },
      night: { n: '달과 별', k: ['밤이', '밤에', '밤하늘', '달이', '달님', '달빛', '보름달', '별이', '별빛', '별처럼', '저녁', '깜깜', '어두'], d: [
        '..y.....y...', '.....yyy....', '....yyy.....', '...yyy....y.', '...yyy......', '...yyy......',
        '...yyy......', '...yyyy.....', '....yyyy.yy.', '.....yyyyy..', '.y..........', '........y...'] },
      tree: { n: '나무', k: ['나무', '숲', '나뭇가지', '그늘', '식목', '심었'], d: [
        '....gggg....', '...gggggg...', '..ggGggggg..', '.ggggggGggg.', '.gGggggggGg.', '.gggggGgggg.',
        '..gggggggg..', '...gggggg...', '.....nn.....', '.....nn.....', '.....nn.....', '....nnnn....'] },
      flower: { n: '꽃', k: ['꽃', '봄', '화단', '화분', '씨앗', '새싹', '싹이', '민들레', '해바라기', '장미', '향기'], d: [
        '.....pp.....', '....pppp....', '.pp.pppp.pp.', 'pppppyyppppp', 'pppppyyppppp', '.pp.pppp.pp.',
        '....pppp....', '.....pp.....', '.....g......', '..gg.g......', '...ggg.gg...', '.....ggg....'] },
      leaf: { n: '단풍잎', k: ['가을', '단풍', '낙엽', '은행잎', '나뭇잎', '열매가 익'], d: [
        '.....r......', '....rrr.....', '.r..rrr..r..', '.rr.rrr.rr..', '.rrrrorrrr..', '..rrrorrr...',
        'rrrrrorrrrr.', '.rrrrorrrr..', '...rrorr....', '.....n......', '.....n......', '.....n......'] },
      mountain: { n: '산', k: ['산에', '산을', '산속', '산이', '산꼭대기', '등산', '산길', '고개', '언덕', '봉우리'], d: [
        '............', '.....w......', '....www.....', '....GGG.....', '...GGGGG....', '...GGGGG.w..',
        '..GGGGGGwww.', '..GGGGGGggg.', '.GGGGGGggggg', '.GGGGGGggggg', 'GGGGGGGggggg', 'GGGGGGGggggg'] },
      sea: { n: '바다', k: ['바다', '파도', '강물', '시냇물', '냇물', '호수', '바닷가', '물결', '갯벌', '섬'], d: [
        '............', '............', '...ww.......', '..wbbw...ww.', '.wbbbbw.wbbw', 'bbbbbbbbbbbb',
        'bbBbbbbbBbbb', 'bbbbbBbbbbbb', 'BbbbbbbbbBbb', 'bbbBbbbbbbbb', 'bbbbbbBbbbbB', 'bbbbbbbbbbbb'] },
      dog: { n: '강아지', k: ['강아지', '개는', '개가', '개와', '개를', '멍멍', '반려견', '안내견'], d: [
        '.nn......nn.', 'nnnn....nnnn', 'nnnssssssnnn', 'nnssssssssnn', '.ssksssskss.', '.ssssssssss.',
        '.ssswwwwsss.', '.sswwkkwwss.', '.sswwwwwwss.', '..swwrrwws..', '...ssrrss...', '....ssss....'] },
      cat: { n: '고양이', k: ['고양이', '야옹'], d: [
        '.o........o.', '.oo......oo.', '.ooo....ooo.', '.oooooooooo.', '.oooooooooo.', '.ookooookoo.',
        '.oooooooooo.', '.ooowppwooo.', 'k.oowwwwoo.k', '..oooooooo..', '...oooooo...', '............'] },
      rabbit: { n: '토끼', k: ['토끼', '깡충'], d: [
        '...ww..ww...', '...wp..pw...', '...wp..pw...', '...wp..pw...', '...ww..ww...', '..wwwwwwww..',
        '..wkwwwwkw..', '..wwwppwww..', '..wwwwwwww..', '...wwwwww...', '..wwwwwwww..', '..ww....ww..'] },
      turtle: { n: '거북', k: ['거북', '엉금엉금', '자라'], d: [
        '............', '............', '...GGGGG....', '..GGgGgGG...', '.GGgGGGgGG..', '.GGGGgGGGGgg',
        '.GGGGGGGGgkg', '..ggggggggg.', '..gg....gg..', '..gg....gg..', '............', '............'] },
      bird: { n: '새', k: ['새가', '새는', '새들', '제비', '참새', '까치', '비둘기', '까마귀', '둥지', '짹짹', '날개'], d: [
        '............', '....bbbb....', '...bbbbbb...', '...bkbbbboo.', '...bbbbbbo..', '..bbbbbbb...',
        '.bbBBBbbbb..', 'bbbBBBBbbb..', '.bbbBBbbbb..', '...bbbbbb...', '....o..o....', '...oo.oo....'] },
      fish: { n: '물고기', k: ['물고기', '금붕어', '고래', '어항', '낚시', '생선'], d: [
        '............', '............', '....ooooo...', 'o..ooooooo..', 'oo.oooooooo.', 'ooooyooooko.',
        'ooooyooooooo', 'oo.oooooooo.', 'o..ooooooo..', '....ooooo...', '............', '............'] },
      butterfly: { n: '나비', k: ['나비', '애벌레', '번데기', '나풀'], d: [
        '....k..k....', '.vv..kk..vv.', 'vvvv.kk.vvvv', 'vyvvvkkvvvyv', 'vvvvvkkvvvvv', '.vvvvkkvvvv.',
        '..pppkkppp..', '.ppppkkpppp.', '.pyppkkppyp.', '..pp.kk.pp..', '.....kk.....', '............'] },
      bee: { n: '꿀벌', k: ['꿀벌', '벌이', '벌들', '벌집', '개미', '곤충', '베짱이', '매미', '잠자리'], d: [
        '............', '............', '...cc..cc...', '..cccccccc..', '...cccccc...', '..yykyykyy..',
        '.yykyykyyky.', '.yykyykyyyy.', '..yykyykyy..', '............', '............', '............'] },
      bear: { n: '곰', k: ['곰', '호랑이', '사자', '여우', '늑대', '동물원', '코끼리', '기린'], d: [
        '.nn......nn.', 'nnnn....nnnn', '.nnnnnnnnnn.', '.nnnnnnnnnn.', '.nnknnnnknn.', '.nnnnnnnnnn.',
        '.nnnssssnnn.', '.nnsskkssnn.', '.nnssssssnn.', '..nnssssnn..', '...nnnnnn...', '............'] },
      frog: { n: '개구리', k: ['개구리', '개굴', '올챙이', '폴짝', '연못'], d: [
        '............', '..gg....gg..', '.gwkg..gwkg.', '.gggggggggg.', 'gggggggggggg', 'gggggggggggg',
        'gkggggggggkg', 'ggkkkkkkkkgg', '.gggggggggg.', '..gggggggg..', '.gg......gg.', 'ggg......ggg'] },
      book: { n: '책', k: ['책을', '책이', '책은', '책의', '책에', '도서관', '독서', '동화', '소설', '읽었', '읽고', '국어사전', '사전에', '이야기'], d: [
        '............', '............', '.bbbbb.bbbbb', '.bwwwwbwwwwb', '.bwkkwbwkkwb', '.bwwwwbwwwwb',
        '.bwkkwbwkkwb', '.bwwwwbwwwwb', '.bwkkwbwkkwb', '.bwwwwbwwwwb', '.bbbbbbbbbbb', '............'] },
      pencil: { n: '연필', k: ['연필', '글을 쓰', '글쓰기', '쓸 때', '고쳐 쓰', '고쳐쓰기', '공책', '일기', '문장을', '문장은', '감상문'], d: [
        '.........pp.', '........pppp', '.......yypp.', '......yyyy..', '.....yyyy...', '....yyyy....',
        '...yyyy.....', '..yyyy......', '.syyy.......', '.ssy........', 'kss.........', 'kk..........'] },
      letter: { n: '편지', k: ['편지', '쪽지', '초대장', '엽서', '올림', '드림', '받는 사람'], d: [
        '............', '............', 'kkkkkkkkkkkk', 'kwwwwwwwwwwk', 'kkwwwwwwwwkk', 'kwkwwwwwwkwk',
        'kwwkwwwwkwwk', 'kwwwkrrkwwwk', 'kwwwwrrwwwwk', 'kwwwwwwwwwwk', 'kkkkkkkkkkkk', '............'] },
      phone: { n: '휴대 전화', k: ['전화', '휴대', '문자 메시지', '메시지', '대화방', '채팅', '댓글', '누리 소통망', '온라인'], d: [
        '...kkkkkk...', '...kcccck...', '...kcccck...', '...kcwwck...', '...kcccck...', '...kcwwck...',
        '...kcccck...', '...kcccck...', '...kcccck...', '...kkkkkk...', '...kkwwkk...', '...kkkkkk...'] },
      computer: { n: '컴퓨터', k: ['컴퓨터', '인터넷', '검색', '누리집', '영상', '화면', '자막', '매체', '개인 정보', '비밀번호', '저작권'], d: [
        '............', '.kkkkkkkkkk.', '.kcccccccck.', '.kcwwwcccck.', '.kcccccccck.', '.kcwwwwwcck.',
        '.kcccccccck.', '.kkkkkkkkkk.', '.....ee.....', '...eeeeee...', '............', '............'] },
      news: { n: '신문', k: ['뉴스', '신문', '기사', '기자', '보도', '육하원칙', '안내문', '공고', '알림'], d: [
        '............', '.wwwwwwwwww.', '.wkkkkkkkkw.', '.wwwwwwwwww.', '.wkkkwweeew.', '.wwwwwweeew.',
        '.wkkkwweeew.', '.wwwwwwwwww.', '.wkkkkkkkkw.', '.wwwwwwwwww.', '.wkkkkkkwww.', '.wwwwwwwwww.'] },
      megaphone: { n: '확성기', k: ['광고', '발표', '주장', '알리', '건의', '제안', '외쳤', '선전'], d: [
        '............', '........rr..', '......rrrr.o', '....rrrrrr..', '.eerrrrrrr.o', '.eerrrrrrr..',
        '.eerrrrrrr.o', '....rrrrrr..', '..e...rrrr.o', '..e.....rr..', '............', '............'] },
      talk: { n: '말풍선', k: ['대화', '말했', '토의', '토론', '의견', '회의', '반론', '찬성', '반대', '사회자', '인사', '높임'], d: [
        '.bbbbbbb....', 'bbbbbbbbb...', 'bbwbwbwbb...', 'bbbbbbbbb...', '.bbbbbbb....', '..bb.ooooooo',
        '.b.ooooooooo', '...oowowowoo', '...ooooooooo', '....ooooooo.', '.........oo.', '..........o.'] },
      question: { n: '물음표', k: ['궁금', '물음', '질문', '물었', '왜 ', '짐작', '추론', '단서', '수수께끼'], d: [
        '............', '....vvvv....', '...vvvvvv...', '..vv....vv..', '........vv..', '.......vv...',
        '......vv....', '.....vv.....', '.....vv.....', '............', '.....vv.....', '.....vv.....'] },
      idea: { n: '전구', k: ['생각', '까닭', '근거', '방법', '해결', '중심', '요약', '간추', '깨달', '교훈', '뜻을'], d: [
        '....yyyy....', '...yyyyyy...', '..yywyyyyy..', '..ywyyyyyy..', '..yyyyyyyy..', '..yyyyyyyy..',
        '...yyyyyy...', '....yyyy....', '....eeee....', '....eeee....', '.....ee.....', '............'] },
      heart: { n: '하트', k: ['마음', '사랑', '고마', '고맙', '공감', '배려', '친절', '소중', '위로', '도와주', '도왔'], d: [
        '............', '..rr....rr..', '.rrrr..rrrr.', 'rrwrrrrrrrrr', 'rwrrrrrrrrrr', 'rrrrrrrrrrrr',
        '.rrrrrrrrrr.', '..rrrrrrrr..', '...rrrrrr...', '....rrrr....', '.....rr.....', '............'] },
      star: { n: '별', k: ['칭찬', '자랑', '멋져', '멋진', '훌륭', '잘했', '격려', '꿈은', '꿈을', '반짝'], d: [
        '.....yy.....', '.....yy.....', '....yyyy....', '....yyyy....', 'yyyyyyyyyyyy', '.yyyyyyyyyy.',
        '..yyyyyyyy..', '...yyyyyy...', '..yyyyyyyy..', '..yyy..yyy..', '.yyy....yyy.', '.y........y.'] },
      clock: { n: '시계', k: ['시계', '시간', '시에', '교시', '어제', '내일', '과거', '미래', '현재', '차례', '순서', '먼저'], d: [
        '....kkkk....', '..kkwwwwkk..', '.kwwwkwwwwk.', '.kwwwkwwwwk.', 'kwwwwkwwwwwk', 'kwwwwkwwwwwk',
        'kwwwwkkkkwwk', 'kwwwwwwwwwwk', '.kwwwwwwwwk.', '.kwwwwwwwwk.', '..kkwwwwkk..', '....kkkk....'] },
      house: { n: '집', k: ['집에', '집으로', '집이', '우리 집', '가족', '할머니', '할아버지', '부모님', '엄마', '아빠', '동생', '마을'], d: [
        '.....rr.....', '....rrrr.nn.', '...rrrrrrnn.', '..rrrrrrrrn.', '.rrrrrrrrrr.', 'rrrrrrrrrrrr',
        '.ssssssssss.', '.sccssssnns.', '.sccssssnns.', '.sssssssnns.', '.sssssssnns.', '.ssssssssss.'] },
      school: { n: '학교', k: ['학교', '교실', '선생님', '우리 반', '학급', '급식', '복도', '수업', '쉬는 시간', '전학'], d: [
        '.....kr.....', '.....krr....', '.....k......', '....oooo....', '...oooooo...', 'oooooooooooo',
        'owwoowwoowwo', 'owwoowwoowwo', 'oooooooooooo', 'owwoonnoowwo', 'owwoonnoowwo', 'ooooonnooooo'] },
      apple: { n: '사과', k: ['사과', '과일', '포도', '딸기', '수박', '열매', '귤', '감나무', '채소', '당근'], d: [
        '......n.g...', '......ngg...', '...rr.nrr...', '..rrrrrrrr..', '.rrwrrrrrrr.', '.rwrrrrrrrr.',
        '.rrrrrrrrrr.', '.rrrrrrrrrr.', '.rrrrrrrrrr.', '..rrrrrrrr..', '...rrrrrr...', '....rr.rr...'] },
      rice: { n: '밥', k: ['밥을', '밥이', '아침밥', '음식', '김밥', '떡', '요리', '라면', '국을', '반찬', '식당', '맛있'], d: [
        '............', '....e..e....', '...e..e.....', '....e..e....', '...wwwwww...', '..wwwwwwww..',
        'bbbbbbbbbbbb', 'bbbbbbbbbbbb', '.bbwbbbbwbb.', '..bbbbbbbb..', '...bbbbbb...', '....bbbb....'] },
      cake: { n: '케이크', k: ['생일', '케이크', '잔치', '축하', '빵', '과자', '우유'], d: [
        '.....y......', '.....o......', '.....r......', '.....r......', '..pppppppp..', '.ppwppppwpp.',
        '.pppppppppp.', '.ssssssssss.', '.srssrssrss.', '.ssssssssss.', '.ssssssssss.', 'eeeeeeeeeeee'] },
      gift: { n: '선물', k: ['선물', '보물', '상자', '나누어', '저금'], d: [
        '...rr..rr...', '..r..rr..r..', '...rrrrrr...', '.bbbbrrbbbb.', '.bbbbrrbbbb.', '.rrrrrrrrrr.',
        '.bbbbrrbbbb.', '.bbbbrrbbbb.', '.bbbbrrbbbb.', '.bbbbrrbbbb.', '.bbbbrrbbbb.', '............'] },
      smile: { n: '웃는 얼굴', k: ['기쁘', '기뻤', '기뻐', '즐겁', '즐거', '신나', '신이 나', '웃었', '웃으', '행복', '싱글벙글', '좋았', '뿌듯'], d: face },
      sad: { n: '슬픈 얼굴', k: ['슬프', '슬펐', '슬퍼', '눈물', '울었', '속상', '쓸쓸', '서운', '보고 싶', '그리'], d: vary({ 6: 'yyybyyyyyyyy', 7: 'yyybyyyyyyyy', 8: '.yyykkkkyyy.', 9: '.yykyyyykyy.' }) },
      angry: { n: '화난 얼굴', k: ['화가', '화를', '화났', '짜증', '억울', '다투', '다퉜', '싸웠', '싸우', '갈등'], d: vary({ 3: '.yykyyyykyy.', 4: 'yyykkyykkyyy', 8: '.yyykkkkyyy.', 9: '.yyyyyyyyyy.' }, 'o') },
      surprise: { n: '놀란 얼굴', k: ['놀라', '놀랐', '깜짝', '신기', '뜻밖', '우아'], d: vary({ 4: 'yykkyyyykkyy', 5: 'yykkyyyykkyy', 7: 'yyyyykkyyyyy', 8: '.yyykyykyyy.', 9: '.yyyykkyyyy.' }) },
      worry: { n: '걱정하는 얼굴', k: ['걱정', '두근', '무서', '겁이', '불안', '긴장', '떨렸', '미안', '사과했', '잘못'], d: vary({ 2: '.yyyyyyyycy.', 3: '.yyykyykycy.', 8: '.yykykykyyy.', 9: '.yyyyyyyyyy.' }) },
      wheelchair: { n: '휠체어', k: ['휠체어', '보조기기', '경사로', '문턱', '승강기', '장애인'], d: [
        '...bb.......', '...bb.......', '..bbb.......', '..bbb.......', '..bbbbbb....', '..bbb.......',
        '..bbbbbbb...', '..kkkk..bb..', '.k....k.bb..', '.k....k..bb.', '.k....k.....', '..kkkk......'] },
      crown: { n: '왕관', k: ['세종', '임금', '왕이', '왕은', '백성', '훈민정음', '놀부', '흥부', '옛날'], d: [
        '............', '............', 'y....yy....y', 'yy...yy...yy', 'yyy.yyyy.yyy', 'yyyyyyyyyyyy',
        'yyyyyyyyyyyy', 'yyryybbyyryy', 'yyyyyyyyyyyy', 'oooooooooooo', '............', '............'] },
      hangul: { n: '한글', k: ['한글', '낱말', '글자', '받침', '맞춤법', '띄어쓰기', '발음', '고유어', '한자어', '외래어', '합성어', '유의어', '반의어', '속담', '관용'], d: [
        'bbbbbbbbbbbb', 'bwwwwwwwwwwb', 'bwkkkkwwkwwb', 'bwwwwkwwkwwb', 'bwwwwkwwkwwb', 'bwwwwkwwkkwb',
        'bwwwkwwwkwwb', 'bwwwkwwwkwwb', 'bwwkwwwwkwwb', 'bwwwwwwwkwwb', 'bwwwwwwwwwwb', 'bbbbbbbbbbbb'] },
      trophy: { n: '우승컵', k: ['이겼', '이기', '우승', '상을', '대회', '시합', '도착했', '노력', '끝까지'], d: [
        '............', '..yyyyyyyy..', 'yyyyyyyyyyyy', 'y.yyyyyyyy.y', 'y.yywyyyyy.y', '.yyyyyyyyyy.',
        '...yyyyyy...', '....yyyy....', '.....yy.....', '.....yy.....', '...nnnnnn...', '...nnnnnn...'] },
      scale: { n: '저울', k: ['비교', '대조', '공통점', '차이점', '같은 점', '다른 점', '타당', '판단', '공평', '관점', '장단점'], d: [
        '.....kk.....', '.kkkkkkkkkk.', '.k...kk...k.', '.k...kk...k.', 'kkk..kk..kkk', 'ooo..kk..ooo',
        '.....kk.....', '.....kk.....', '.....kk.....', '.....kk.....', '...kkkkkk...', '..kkkkkkkk..'] },
      magnifier: { n: '돋보기', k: ['찾아', '찾을', '살펴', '관찰', '조사', '자세히', '확인', '출처', '구별'], d: [
        '...kkkk.....', '..kcccck....', '.kccwccck...', '.kcwcccck...', '.kcccccck...', '.kcccccck...',
        '..kcccck....', '...kkkkkk...', '.......nnn..', '........nnn.', '.........nnn', '..........nn'] },
      chart: { n: '그래프', k: ['그래프', '표를', '표에', '도표', '통계', '명이', '%', '조사 결과', '시간표'], d: [
        'k...........', 'k.......rr..', 'k.......rr..', 'k....gg.rr..', 'k....gg.rr..', 'k....gg.rr..',
        'k.bb.gg.rr..', 'k.bb.gg.rr..', 'k.bb.gg.rr..', 'k.bb.gg.rr..', 'kkkkkkkkkkkk', '............'] },
      light: { n: '신호등', k: ['신호등', '횡단보도', '초록불', '빨간불', '표지판', '안전', '교통', '규칙', '비상구'], d: [
        '...kkkkkk...', '...kkrrkk...', '...krrrrk...', '...kkrrkk...', '...kkyykk...', '...kyyyyk...',
        '...kkyykk...', '...kkggkk...', '...kggggk...', '...kkggkk...', '...kkkkkk...', '.....kk.....'] },
      stage: { n: '무대', k: ['극본', '연극', '대본', '무대', '해설', '지문', '대사', '배우', '공연', '낭송'], d: [
        'rrrrrrrrrrrr', 'rrrrrrrrrrrr', 'rrr......rrr', 'rr........rr', 'rr...yy...rr', 'rr..yyyy..rr',
        'r...yyyy...r', 'r....bb....r', 'r...bbbb...r', 'r...bbbb...r', 'nnnnnnnnnnnn', 'nnnnnnnnnnnn'] },
      music: { n: '음표', k: ['노래', '음악', '운율', '리듬', '되풀이', '반복', '소리 내어', '가수', '피아노'], d: [
        '....kkkkkkk.', '....kkkkkkk.', '....k.....k.', '....k.....k.', '....k.....k.', '....k.....k.',
        '....k.....k.', '..kkk...kkk.', '.kkkk..kkkk.', '.kkkk..kkkk.', '..kk....kk..', '............'] },
      bus: { n: '버스', k: ['버스', '여행', '기행문', '여정', '견문', '소풍', '체험 학습', '박물관', '출발', '기차'], d: [
        '............', '.yyyyyyyyyy.', 'yyyyyyyyyyyy', 'ycccyccycccy', 'ycccyccycccy', 'yyyyyyyyyyyy',
        'yyyyyyyyyyyy', 'yyyyyyyyyyyy', 'yykkyyyykkyy', '..kk....kk..', '............', '............'] }
    }
  };

  /* 도트를 잘게 다듬기: 12칸 그림을 48칸으로 늘리면서 계단진 윤곽을 부드럽게 하고(Scale2x 두 번),
     가장자리에 밝은 면과 어두운 면을 넣어 입체감을 준다. 결과는 한 번만 계산해 둔다. */
  var PX = window.PIXART, cache = {};
  function scale2x(g) {
    var n = g.length, out = [], y, x;
    function at(yy, xx) { return yy < 0 || xx < 0 || yy >= n || xx >= n ? '.' : g[yy][xx]; }
    for (y = 0; y < n; y++) {
      var r1 = '', r2 = '';
      for (x = 0; x < n; x++) {
        var P = g[y][x], A = at(y - 1, x), B = at(y, x + 1), C = at(y, x - 1), D = at(y + 1, x);
        r1 += (C === A && C !== D && A !== B) ? A : P;
        r1 += (A === B && A !== C && B !== D) ? B : P;
        r2 += (D === C && D !== B && C !== A) ? C : P;
        r2 += (B === D && B !== A && D !== C) ? D : P;
      }
      out.push(r1, r2);
    }
    return out;
  }
  function tone(hex, f) {
    var v = parseInt(hex.slice(1), 16), c = [v >> 16, (v >> 8) & 255, v & 255].map(function (x) {
      x = f > 0 ? x + (255 - x) * f : x * (1 + f);
      return ('0' + Math.round(Math.max(0, Math.min(255, x))).toString(16)).slice(-2);
    });
    return '#' + c.join('');
  }
  /* 그림 열쇠 → { size: 48, rows: [[색 또는 null, …], …] } */
  PX.fine = function (key) {
    if (cache[key]) return cache[key];
    var art = PX.art[key];
    if (!art) return null;
    var g = scale2x(scale2x(art.d)), n = g.length, rows = [], y, x;
    function ch(yy, xx) { return yy < 0 || xx < 0 || yy >= n || xx >= n ? '.' : g[yy][xx]; }
    for (y = 0; y < n; y++) {
      var row = [];
      for (x = 0; x < n; x++) {
        var c = g[y][x];
        if (c === '.' || !PX.pal[c]) { row.push(null); continue; }
        var col = PX.pal[c];
        if (c !== 'k') {
          if (ch(y + 1, x) === '.' || ch(y, x + 1) === '.' || ch(y + 2, x) === '.' || ch(y, x + 2) === '.') col = tone(col, -0.2);
          else if (ch(y - 1, x) === '.' || ch(y, x - 1) === '.') col = tone(col, 0.28);
          else if (ch(y - 2, x) === '.' || ch(y, x - 2) === '.') col = tone(col, 0.14);
        }
        row.push(col);
      }
      rows.push(row);
    }
    return (cache[key] = { size: n, rows: rows });
  };
})();
