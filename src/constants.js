export const links = {
    windowsVerificator: 'https://github.com/clcert/pyrios/releases/download/v2.0.0/pyrios-v2.0.0-windows-amd64.zip',
    verificators: 'https://github.com/clcert/pyrios/releases/tag/v2.0.0',
}

export const events = {
    trustee_created: {
        name: "Creación de custodio(a) de clave",
        descript: "La persona indicada ha sido seleccionada como custodio de una de las claves privadas de la elección.",
        detail: "Custodio(a): "
    },
    public_key_uploaded: {
        name: "Creación de clave pública",
        descript: "La clave pública de la elección ha sido generada y almacenada.",
    },
    voter_file_uploaded: {
        name: "Carga de padrón al sistema",
        descript: "La lista de votantes, con sus respectivos nombres de usuario, ha sido cargada al sistema.",
    },
    voting_started: {
        name: "Inicio de elección",
        descript: "La elección ha comenzado.",
    },
    voting_stopped: {
        name: "Termino de elección",
        descript: "La elección ha finalizado.",
    },
    tally_computed: {
        name: "Cálculo de precómputo",
        descript: "El precómputo ha sido calculado, aún no estñan los resultados de la elección.",
    },
    decryption_recieved: {
        name: "Se han recibido desencriptaciones parciales",
        descript: "Los custodios han ingresado sus claves privadas para calcular las desencriptaciones.",
    },
    decryptions_combined: {
        name: "Combinación de desencriptaciones parciales",
        descript: "Las desencriptaciones parciales se han combinado para obtener el resultado de la elección.",
    },
    electoral_roll_modified: {
        name: "Modificación al padrón",
        descript: "La lista de votantes ha sido actualizada.",
    }
}

export const permanentOptions = {
    whiteOptionText: 'Voto Blanco',
    nullOptionText: 'Voto Nulo'
}


export const electionStatus = {
    settingUp : "Setting up",
    started : "Started",
    ended : "Ended",
    tallyComputed : "Tally computed",
    decryptionsUploaded : "Decryptions uploaded",
    decryptionsCombined : "Decryptions combined",
    resultsReleased : "Results released"
}

export const permanentOptionsList = Object.values(permanentOptions)