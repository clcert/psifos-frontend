class Steps {
  constructor() {
    this.actual_step = 0;
    this.execute = false;
    this.secret_key = null;
    //this.storage = window.localStorage;
    this.certificate = null;
    this.coefficients = null;
    this.points = null;
    this.acknowledgements = null;
    this.verification_key = null;
    this.interval = null;
  }

  init_process() {
    this.execute = false;
    this.total_process();
    $("#button-init").attr("disabled", true);
    this.interval = window.setInterval(() => {
      this.total_process();
    }, 1000);
  }

  total_process() {
    this.get_step();
    if (this.actual_step === 0 && !this.execute) {
      console.log("Step 0");
      this.execute = true;
      this.step_0();
    } else if (this.actual_step === 1 && !this.execute) {
      console.log("Step 1");
      this.execute = true;
      this.step_1();
    } else if (this.actual_step === 2 && !this.execute) {
      console.log("Step 2");
      this.execute = true;
      this.step_2();
    } else if (this.actual_step === 3 && !this.execute) {
      console.log("Step 3");
      this.execute = true;
      this.step_3();
    } else if (this.actual_step === 4) {
      window.clearInterval(this.interval);
      $("#process_step").text("Proceso completado!");
    }
  }

  step_0() {
    this.generate_keypair();
    this.download_sk_to_file("trustee_key_for{{election.name}}.txt");
    this.send_public_key();
    $("#process_step").text(
      "Proceso de generación de clave privada completado"
    );
  }

  step_1() {
    this.get_data_step("step1").then((data) => {
      if ("error" in data) {
        this.execute = false;
        $("#process_step").text(data["error"]);
        return;
      }

      $.getJSON("../../get-randomness", function (result) {
        sjcl.random.addEntropy(result.randomness);
        BigInt.setup(function () {
          PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data["params"]));
          PARAMS.trustee_id = "{{trustee.trustee_id}};";
          CERTIFICATES = JSON.parse(data["certificates"]);
        });

        heliosc.ui.validator.start();
        heliosc.ui.load_secret_key("#derive");
        derivator.start();
      });
    });
  }

  step_2() {
    this.get_data_step("step2").then((data) => {
      if ("error" in data) {
        this.execute = false;
        $("#process_step").text(data["error"]);
        return;
      }
      // get some more server-side randomness for keygen
      $.getJSON("../../get-randomness", function (result) {
        sjcl.random.addEntropy(result.randomness);
        BigInt.setup(function () {
          PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data["params"]));
          PARAMS.trustee_id = "{{trustee.trustee_id}}";
          CERTIFICATES = JSON.parse(data["certificates"]);
          COEFFICIENTS = JSON.parse(data["coefficents"]);
          POINTS = JSON.parse(data["points"]);
        });
        heliosc.ui.validator.start();
        heliosc.ui.load_secret_key("#acknowledge");
        acknowledger.start();
      });
    });
  }

  step_3() {
    this.get_data_step("step3").then((data) => {
      if ("error" in data) {
        this.execute = false;
        $("#process_step").text(data["error"]);
        return;
      }
      // get some more server-side randomness for keygen
      $.getJSON("../../get-randomness", function (result) {
        sjcl.random.addEntropy(result.randomness);
        BigInt.setup(function () {
          PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data["params"]));
          PARAMS.trustee_id = "{{trustee.trustee_id}}";
          CERTIFICATES = JSON.parse(data["certificates"]);
          COEFFICIENTS = JSON.parse(data["coefficents"]);
          POINTS = JSON.parse(data["points"]);
          SENT = JSON.parse(data["points_sent"]);
          ACKS2 = data["acks"];
        });
        heliosc.ui.validator.start();
        heliosc.ui.load_secret_key("#check_acks");
        check_acks.start();
        heliosc.ui.share.start(this.prepare_upload);
      });
    });
  }

  async get_data_step(step) {
    let election_uuid = "{{election.uuid}}";
    let trustee_uuid = "{{trustee.uuid}}";
    let url =
      "/app/elections/" +
      String(election_uuid) +
      "/trustees/" +
      String(trustee_uuid) +
      "/" +
      step;
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonResponse = await resp.json();
    return jsonResponse;
  }

  async get_step() {
    let election_uuid = "{{election.uuid}}";
    let trustee_uuid = "{{trustee.uuid}}";
    let url =
      "/app/elections/" +
      String(election_uuid) +
      "/trustees/" +
      String(trustee_uuid) +
      "/" +
      "get-step";
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonResponse = await resp.json();
    this.actual_step = jsonResponse["status"];
    return jsonResponse;
  }

  generate_keypair() {
    //$('#buttons').hide();
    try {
      TRUSTEE = heliosc.trustee(ELGAMAL_PARAMS);
      this.setup_public_key_and_proof();
      return true;
    } catch (e) {
      alert(e);
      return false;
    }
  }

  setup_public_key_and_proof() {
    CERTIFICATE = TRUSTEE.generate_certificate();
    SECRET_KEY = TRUSTEE.get_secret_key();
    this.secret_key = SECRET_KEY;
    //this.storage.setItem('key', SECRET_KEY);
    this.certificate = jQuery.toJSON(CERTIFICATE);
  }


  download_sk_to_file(filename) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + SECRET_KEY);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  prepare_upload() {
    var pk = {
        g: PARAMS.g.toString(),
        p: PARAMS.p.toString(),
        q: PARAMS.q.toString(),
        y: PARAMS.g.modPow(SUM, PARAMS.p).toString()
    };
    process.verification_key = jQuery.toJSON(pk);
    const verification_key = process.verification_key
    send_step(3, JSON.stringify({
        verification_key: verification_key,
    }));
};

  async send_public_key() {
    $("#public_key_status").text("Enviando la clave publica...");

    let election_uuid = "{{election.uuid}}";
    let trustee_uuid = "{{trustee.uuid}}";
    let certificate = this.certificate;
    let url =
      "/app/elections/" +
      String(election_uuid) +
      "/trustees/" +
      String(trustee_uuid) +
      "/upload-pk";
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_key_json: certificate,
      }),
    });

    const jsonResponse = await resp.json();
    $("#public_key_status").text("Clave publica enviada!!");
    this.actual_step = 1;
    this.execute = false;
    set_step_init();
  }


}
