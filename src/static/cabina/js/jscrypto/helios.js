//
// Helios Protocols
//
// ben@adida.net
//
// FIXME: needs a healthy refactor/cleanup based on Class.extend()
//

// extend jquery to do object keys
// from http://snipplr.com/view.php?codeview&id=10430
/*
$.extend({
    keys: function(obj){
        var a = [];
        $.each(obj, function(k){ a.push(k) });
        return a.sort();
    }
});
*/

import { ElGamal } from "./elgamal";
import { BigInt } from "./bigint";
import { b64_sha256 } from "./sha2";
import { Random } from "./random";

export var UTILS = {};
var _ = require("lodash");

UTILS.array_remove_value = function (arr, val) {
  var new_arr = [];
  _(arr).each(function (v, i) {
    if (v != val) {
      new_arr.push(v);
    }
  });

  return new_arr;
};

UTILS.select_element_content = function (element) {
  var range;
  if (window.getSelection) {
    // FF, Safari, Opera
    var sel = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(element);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    document.selection.empty();
    range = document.body.createTextRange();
    var el = new HELIOS.Election();
    range.moveToElementText(el);
    range.select();
  }
};

// a progress tracker

class PROGRESS {
  constructor() {
    this.n_ticks = 0.0;
    this.current_tick = 0.0;
  }

  addTicks(n_ticks) {
    this.n_ticks += n_ticks;
  }

  tick() {
    this.current_tick += 1.0;
  }

  progress() {
    return Math.round((this.current_tick / this.n_ticks) * 100);
  }
}
UTILS.PROGRESS = PROGRESS;

// produce the same object but with keys sorted
UTILS.object_sort_keys = function (obj) {
  var new_obj = {};
  _(_.keys(obj)).each(function (k) {
    new_obj[k] = obj[k];
  });
  return new_obj;
};

//
// Helios Stuff
//

export let HELIOS = {};

// a bogus default public key to allow for ballot previewing, nothing more
// this public key should not be used ever, that's why the secret key is
// not given.
HELIOS.get_bogus_public_key = function () {
  return ElGamal.PublicKey.fromJSONObject(
    JSON.parse(
      '{"g": "14887492224963187634282421537186040801304008017743492304481737382571933937568724473847106029915040150784031882206090286938661464458896494215273989547889201144857352611058572236578734319505128042602372864570426550855201448111746579871811249114781674309062693442442368697449970648232621880001709535143047913661432883287150003429802392229361583608686643243349727791976247247948618930423866180410558458272606627111270040091203073580238905303994472202930783207472394578498507764703191288249547659899997131166130259700604433891232298182348403175947450284433411265966789131024573629546048637848902243503970966798589660808533", "p": "16328632084933010002384055033805457329601614771185955389739167309086214800406465799038583634953752941675645562182498120750264980492381375579367675648771293800310370964745767014243638518442553823973482995267304044326777047662957480269391322789378384619428596446446984694306187644767462460965622580087564339212631775817895958409016676398975671266179637898557687317076177218843233150695157881061257053019133078545928983562221396313169622475509818442661047018436264806901023966236718367204710755935899013750306107738002364137917426595737403871114187750804346564731250609196846638183903982387884578266136503697493474682071", "q": "61329566248342901292543872769978950870633559608669337131139375508370458778917", "y": "8049609819434159960341080485505898805169812475728892670296439571117039276506298996734003515763387841154083296559889658342770776712289026341097211553854451556820509582109412351633111518323196286638684857563764318086496248973278960517204721786711381246407429787246857335714789053255852788270719245108665072516217144567856965465184127683058484847896371648547639041764249621310049114411288049569523544645318180042074181845024934696975226908854019646138985505600641910417380245960080668869656287919893859172484656506039729440079008919716011166605004711585860172862472422362509002423715947870815838511146670204726187094944"}'
    )
  );
};

class Election {
  constructor() {}

  toJSONObject() {
    var json_obj = {
      uuid: this.uuid,
      description: this.description,
      short_name: this.short_name,
      name: this.name,
      public_key: this.public_key.toJSONObject(),
      questions: this.questions,
      cast_url: this.cast_url,
      frozen_at: this.frozen_at,
      openreg: this.openreg,
      voters_hash: this.voters_hash,
      use_voter_aliases: this.use_voter_aliases,
      voting_starts_at: this.voting_starts_at,
      voting_ends_at: this.voting_ends_at,
    };

    return UTILS.object_sort_keys(json_obj);
  }

  get_hash() {
    if (this.election_hash) return this.election_hash;

    // otherwise
    return b64_sha256(this.toJSON());
  }

  toJSON() {
    // FIXME: only way around the backslash thing for now.... how ugly
    //return jQuery.toJSON(this.toJSONObject()).replace(/\//g,"\\/");
    return JSON.stringify(this.toJSONObject());
  }
}

HELIOS.Election = Election;

// election

HELIOS.Election.fromJSONString = function (raw_json) {
  var json_object = JSON.parse(raw_json);
  json_object.questions = JSON.parse(json_object.questions);
  json_object.public_key = JSON.parse(json_object.public_key);

  // let's hash the raw_json
  var election = HELIOS.Election.fromJSONObject(json_object);
  election.election_hash = b64_sha256(raw_json);

  return election;
};

HELIOS.Election.fromJSONObject = function (d) {
  var el = new HELIOS.Election();
  _.extend(el, d);

  // empty questions
  if (!el.questions) el.questions = [];

  if (el.public_key) {
    el.public_key = ElGamal.PublicKey.fromJSONObject(el.public_key);
  } else {
    // a placeholder that will allow hashing;
    el.public_key = HELIOS.get_bogus_public_key();
    el.BOGUS_P = true;
  }

  return el;
};

HELIOS.Election.setup = function (election) {
  return HELIOS.Election.fromJSONObject(election);
};

// ballot handling
export let BALLOT = {};

BALLOT.pretty_choices = function (election, ballot) {
  var questions = election.questions;
  var answers = ballot.answers;

  // process the answers
  var choices = _(questions).map(function (q, q_num) {
    return _(answers[q_num]).map(function (ans) {
      return questions[q_num].answers[ans];
    });
  });

  return choices;
};

// open up a new window and do something with it.
UTILS.open_window_with_content = function (content, mime_type) {
  if (!mime_type) mime_type = "text/plain";
  if (BigInt.is_ie) {
    let w = window.open("");
    w.document.open(mime_type);
    w.document.write(content);
    w.document.close();
  } else {
    let w = window.open(
      "data:" + mime_type + "," + encodeURIComponent(content)
    );
  }
};

// generate an array of the first few plaintexts
UTILS.generate_plaintexts = function (pk, min, max) {
  var last_plaintext = BigInt.ONE;

  // an array of plaintexts
  var plaintexts = [];

  if (min == null) min = 0;

  // questions with more than one possible answer, add to the array.
  for (var i = 0; i <= max; i++) {
    if (i >= min)
      plaintexts.push(new ElGamal.Plaintext(last_plaintext, pk, false));
    last_plaintext = last_plaintext.multiply(pk.g).mod(pk.p);
  }

  return plaintexts;
};

//
// Tally abstraction
//

class Tally {
  constructor(raw_tally, num_tallied) {
    this.tally = raw_tally;
    this.num_tallied = num_tallied;
  }

  toJSONObject() {
    var tally_json_obj = _(this.tally).map(function (one_q) {
      return _(one_q).map(function (one_a) {
        return one_a.toJSONObject();
      });
    });

    return {
      num_tallied: this.num_tallied,
      tally: tally_json_obj,
    };
  }
}
HELIOS.Tally = Tally;

HELIOS.Tally.fromJSONObject = function (d, public_key) {
  var num_tallied = d["num_tallied"];

  var raw_tally = _(d["tally"]).map(function (one_q) {
    return _(one_q).map(function (one_a) {
      var new_val = ElGamal.Ciphertext.fromJSONObject(one_a, public_key);
      return new_val;
    });
  });

  return new HELIOS.Tally(raw_tally, num_tallied);
};

//
// distributed decryption : Trustees
//

// a utility function for jsonifying a list of lists of items
HELIOS.jsonify_list_of_lists = function (lol) {
  if (!lol) return null;

  return _(lol).map(function (sublist) {
    return _(sublist).map(function (item) {
      return item.toJSONObject();
    });
  });
};

// a utility function for doing the opposite with an item-level de-jsonifier
HELIOS.dejsonify_list_of_lists = function (lol, item_dejsonifier) {
  if (!lol) return null;

  return _(lol).map(function (sublist) {
    return _(sublist).map(function (item) {
      return item_dejsonifier(item);
    });
  });
};

class Trustee {
  constructor(
    uuid,
    public_key,
    public_key_hash,
    pok,
    decryption_factors,
    decryption_proofs
  ) {
    this.uuid = uuid;
    this.public_key = public_key;
    this.public_key_hash = public_key_hash;
    this.pok = pok;
    this.decryption_factors = decryption_factors;
    this.decryption_proofs = decryption_proofs;
  }

  toJSONObject() {
    return {
      decryption_factors: HELIOS.jsonify_list_of_lists(this.decryption_factors),
      decryption_proofs: HELIOS.jsonify_list_of_list(this.decryption_proofs),
      email: this.email,
      name: this.name,
      pok: this.pok.toJSONObject(),
      public_key: this.public_key.toJSONObject(),
    };
  }
}
HELIOS.Trustee = Trustee;

HELIOS.Trustee.fromJSONObject = function (d) {
  return new HELIOS.Trustee(
    d.uuid,
    ElGamal.PublicKey.fromJSONObject(d.public_key),
    d.public_key_hash,
    ElGamal.DLogProof.fromJSONObject(d.pok),
    HELIOS.dejsonify_list_of_lists(d.decryption_factors, BigInt.fromJSONObject),
    HELIOS.dejsonify_list_of_lists(
      d.decryption_proofs,
      ElGamal.Proof.fromJSONObject
    )
  );
};
