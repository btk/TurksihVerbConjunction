Array.prototype.contains = function (obj) {
  return this.indexOf(obj) > -1;
};

String.prototype.contains = function (it) {
  return this.indexOf(it) != -1;
};

const gorGecZam = ["dı", "di", "du", "dü", "tı", "ti", "tu", "tü"];
const ogrGecZam = ["mış", "miş", "muş", "müş"];
const simZam = ["ıyor", "iyor", "uyor", "üyor"];
const gelZam = ["ecek", "acak"];
const genZam = ["ır", "ir", "ur", "ür", "ar", "er"];

const gerKip = ["malı", "meli"];
const dilKip = ["sa", "se"];
const istKip = ["e", "a"];
const emrKip = [];

const haber = { gorGecZam, ogrGecZam, simZam, gelZam, genZam };
const dilek = { gerKip, dilKip, istKip, emrKip };

const ek = { haber, dilek };

const sesliHarf = ["a", "e", "ı", "i", "o", "ö", "u", "ü"];

const possessors = ["ben", "sen", "o", "biz", "siz", "onlar"];

function lastSesliHarf(fiil) {
  var i = 1;
  while (!sesliHarf.contains(fiil[fiil.length - i])) {
    i++;
  }
  return fiil[fiil.length - i];
}

function lastHarf(fiil) {
  if (sesliHarf.contains(fiil[fiil.length - 1])) {
    return fiil[fiil.length - 1];
  } else {
    return false;
  }
}

function lastHarfPlain(fiil) {
  return fiil[fiil.length - 1];
}

function multipleCheck(inst, arr) {
  return arr.contains(inst);
}


function fiilCek(fiil, cekimEki) {
  if (ek.haber[cekimEki] != undefined) {
    let lsh = lastSesliHarf(fiil);
    switch (cekimEki) {
    case "gorGecZam":
      /*
      indicate the ogrGecZam addition
      by the last vwl letter in word being
      a-ı => dı-tı
      e-i => di-ti
      o-u => du-tu
      ö-ü => dü-tü
      --
      use -t(x) mode instead -d(x) when
      the last letter of the verb is
      hard unvwl (p,ç,t,k)
      */
      let isHard;
      if (!sesliHarf.contains(lastHarfPlain(fiil))) {
        if (multipleCheck(lastHarfPlain(fiil), ["p", "ç", "t", "k", "ş"])) {
          isHard = true;
        } else {
          isHard = false;
        }
      }
      if (multipleCheck(lsh, ["a", "ı"])) {
        return fiil + ek.haber[cekimEki][!isHard ? 0 : 4];
      } else if (multipleCheck(lsh, ["e", "i"])) {
        return fiil + ek.haber[cekimEki][!isHard ? 1 : 5];
      } else if (multipleCheck(lsh, ["o", "u"])) {
        return fiil + ek.haber[cekimEki][!isHard ? 2 : 6];
      } else if (multipleCheck(lsh, ["ö", "ü"])) {
        return fiil + ek.haber[cekimEki][!isHard ? 3 : 7];
      }

    case "ogrGecZam":
      /*
      indicate the ogrGecZam addition
      by the last vwl letter in word being
      a-ı => mış
      e-i => miş
      o-u => muş
      ö-ü => müş
      */
      if (multipleCheck(lsh, ["a", "ı"])) {
        return fiil + ek.haber[cekimEki][0];
      } else if (multipleCheck(lsh, ["e", "i"])) {
        return fiil + ek.haber[cekimEki][1];
      } else if (multipleCheck(lsh, ["o", "u"])) {
        return fiil + ek.haber[cekimEki][2];
      } else if (multipleCheck(lsh, ["ö", "ü"])) {
        return fiil + ek.haber[cekimEki][3];
      }
    case "simZam":
      /*
      indicate the simZam addition
      by the last vwl letter in word being
      a-ı => ıyor
      e-i => iyor
      o-u => uyor
      ö-ü => üyor
      -- var simZam = ["ıyor", "iyor", "uyor", "üyor"];
      - special: -t, ye
      */
      if (sesliHarf.contains(lastHarf(fiil))) {
        fiil = fiil.substring(0, fiil.length - 1);
      }

      if (lastHarfPlain(fiil) == "t" && sesliHarf.contains(fiil[fiil.length - 2])) {
        fiil = fiil.substring(0, fiil.length - 1) + "d";
      }
      if (fiil == "y") {
        return "yiyor";
      } else {
        lsh = lastSesliHarf(fiil);
        if (multipleCheck(lsh, ["a", "ı"])) {
          return fiil + ek.haber[cekimEki][0];
        } else if (multipleCheck(lsh, ["e", "i"])) {
          return fiil + ek.haber[cekimEki][1];
        } else if (multipleCheck(lsh, ["o", "u"])) {
          return fiil + ek.haber[cekimEki][2];
        } else if (multipleCheck(lsh, ["ö", "ü"])) {
          return fiil + ek.haber[cekimEki][3];
        }
      }

    case "gelZam":
      /*
      indicate the gelZam addition
      by the last vwl letter in word being
      a-ı-o-u => acak
      e-i-ö-ü => ecek
      --
      - special: -t, ye
      */
      if (lastHarfPlain(fiil) == "t" && sesliHarf.contains(fiil[fiil.length - 2])) {
        fiil = fiil.substring(0, fiil.length - 1) + "d";
      }
      if (fiil == "ye") { fiil = "yi"; }
      if (sesliHarf.contains(lastHarf(fiil))) {
        fiil = fiil + "y";
      }
      if (multipleCheck(lsh, ["e", "i", "ö", "ü"])) {
        return fiil + ek.haber[cekimEki][0];
      } else {
        return fiil + ek.haber[cekimEki][1];
      }

    case "genZam":
      /*
      **BUGGY**
      indicate the gelZam addition
      by the last vwl letter in word being
      a - ar
      --
      - special: -t, kullan
      - also: add "y" to the verbs ends with a vwl letter
      before adding addition.
      */
      if (lastHarfPlain(fiil) == "t" && sesliHarf.contains(fiil[fiil.length - 2])) {
        fiil = fiil.substring(0, fiil.length - 1) + "d";
      }
      if (lastHarf(fiil) == lastSesliHarf(fiil)) {
        return fiil + "r";
      } else {
        return fiil + lastSesliHarf(fiil) + "r" + "*";
      }

    } //Switch
    // Haber
  } else if (ek.dilek[cekimEki] != undefined) {
    let lsh = lastSesliHarf(fiil);
    switch (cekimEki) {
    case "gerKip":
      /*
      indicate the gerKip addition
      by the last vwl letter in word being
      a, ı, o, u - malı
      e, i, ö, ü - meli
      --
      */
      if (multipleCheck(lsh, ["e", "i", "ö", "ü"])) {
        return fiil + ek.dilek[cekimEki][1];
      } else {
        return fiil + ek.dilek[cekimEki][0];
      }

    case "dilKip":
      /*
      indicate the gerKip addition
      by the last vwl letter in word being
      a, ı, o, u - sa
      e, i, ö, ü - se
      --
      */
      if (multipleCheck(lsh, ["e", "i", "ö", "ü"])) {
        return fiil + ek.dilek[cekimEki][1];
      } else {
        return fiil + ek.dilek[cekimEki][0];
      }

    case "istKip":
      /*
       indicate the gerKip addition
       by the last vwl letter in word being
       a, ı, o, u - a
       e, i, ö, ü - e
       --
       - speacial: -t, ye-
       - also: add "y" letter at the end of words
       which ends with a vwl letter.
       */
      if (sesliHarf.contains(lastHarf(fiil))) {
        fiil = fiil + "y";
      }
      if (lastHarfPlain(fiil) == "t" && sesliHarf.contains(fiil[fiil.length - 2])) {
        fiil = fiil.substring(0, fiil.length - 1) + "d";
      }
      if (fiil == "yey") { fiil = "yiy"; }
      if (multipleCheck(lsh, ["e", "i", "ö", "ü"])) {
        return fiil + ek.dilek[cekimEki][0];
      } else {
        return fiil + ek.dilek[cekimEki][1];
      }
    case "emrKip":
      // LooooL
      return fiil;
    } //Switch

    //Dilek
  } else {
    console.log("Bu çekim eki kodu tanınamadı.");
  }
}


function addPossessive(verb, possessor, cekimEki) {
  let lsh = lastSesliHarf(verb);
  let add = multipleCheck(lsh, ["a", "ı", "o", "u"]) ? "ı" : "i";
  switch (possessor) {
  case possessors[0]:
    if (cekimEki == "gorGecZam") {
      return verb + "m";
    } else if (cekimEki == "ogrGecZam") {
      return verb + lsh + "m";
    } else if (cekimEki == "simZam") {
      return verb + "um";
    } else if (cekimEki == "gelZam") {
      return verb.substring(0, verb.length - 1) + "ğ" + add + "m";
    } else if (cekimEki == "genZam") {
      return verb + add + "m";
    } else if (cekimEki == "gerKip") {
      return verb + "y" + lsh + "m";
    } else if (cekimEki == "dilKip") {
      return verb + "m";
    } else if (cekimEki == "istKip") {
      return verb + "m";
    } else if (cekimEki == "emrKip") {
      return verb;
    }
  case possessors[1]:
    if (cekimEki == "gorGecZam") {
      return verb + "n";
    } else if (cekimEki == "ogrGecZam") {
      return verb + "s" + lsh + "n";
    } else if (cekimEki == "simZam") {
      return verb + "sun";
    } else if (cekimEki == "gelZam") {
      return verb.substring(0, verb.length - 1) + "ğ" + add + "n";
    } else if (cekimEki == "genZam") {
      return verb + "s" + add + "n";
    } else if (cekimEki == "gerKip") {
      return verb + "s" + lsh + "n";
    } else if (cekimEki == "dilKip") {
      return verb + "n";
    } else if (cekimEki == "istKip") {
      return verb + "n";
    } else if (cekimEki == "emrKip") {
      return verb;
    }
  case possessors[2]:
    return verb;
  case possessors[3]:
    if (cekimEki == "gorGecZam") {
      return verb + "k";
    } else if (cekimEki == "ogrGecZam") {
      return verb + lsh + "z";
    } else if (cekimEki == "simZam") {
      return verb + "uz";
    } else if (cekimEki == "gelZam") {
      return verb.substring(0, verb.length - 1) + "ğ" + add + "z";
    } else if (cekimEki == "genZam") {
      return verb + add + "z";
    } else if (cekimEki == "gerKip") {
      return verb + "y" + lsh + "z";
    } else if (cekimEki == "dilKip") {
      return verb + "k";
    } else if (cekimEki == "istKip") {
      return verb + "k";
    } else if (cekimEki == "emrKip") {
      return verb;
    }
  case possessors[4]:
    if (cekimEki == "gorGecZam") {
      return verb + "n" + lsh + "z";
    } else if (cekimEki == "ogrGecZam") {
      return verb + "s" + lsh + "n" + lsh + "z";
    } else if (cekimEki == "simZam") {
      return verb + "sunuz";
    } else if (cekimEki == "gelZam") {
      return verb + "s" + add + "n" + add + "z";
    } else if (cekimEki == "genZam") {
      return verb + "s" + lsh + "n" + add + "z";
    } else if (cekimEki == "gerKip") {
      return verb + "s" + lsh + "n" + add + "z";
    } else if (cekimEki == "dilKip") {
      return verb + "n" + add + "z";
    } else if (cekimEki == "istKip") {
      return verb + "n" + add + "z";
    } else if (cekimEki == "emrKip") {
      return verb;
    }
  case possessors[5]:
    let addM = multipleCheck(lsh, ["e", "ü", "i", "ö"]) ? "e" : "a";
    if (cekimEki == "emrKip") {
      return verb;
    } else {
      return verb + "l" + addM + "r";
    }
  }
  return verb + "(plain)";
}

if(process.argv[2] == "-h"){
	console.log("Use the following command formula for conjunction:");
	console.log("'turconj <TurkishVerb> <TenceSubstring> <Possessor>'");
	console.log("---");
	console.log("Tence substrings:");
	console.log("gorGecZam: Görülen Geçmiş Zaman");
	console.log("ogrGecZam: Öğrenilen Geçmiş Zaman");
	console.log("simZam: Şimdiki Zaman");
	console.log("gelZam: Gelecek Zaman");
	console.log("genZam: Geniş Zaman");
	console.log("--");
	console.log("gerKip: Gereklilik Kipi");
	console.log("dilKip: Dilek Kipi");
	console.log("istKip: İstek Kipi");
	console.log("emrKip: Emir Kipi");
	console.log("---");
	console.log("Possessors: ben, sen, o, biz, siz, onlar");
	
}else{
	if(process.argv[2] && process.argv[3] && process.argv[4]){
	console.log(addPossessive(fiilCek(process.argv[2], process.argv[3]), process.argv[4], process.argv[3]));
	}else{
	console.log("Use 'turconj -h' for more information.");
	}
}