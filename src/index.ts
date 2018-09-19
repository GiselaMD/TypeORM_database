import "reflect-metadata";
import {createConnection, Between} from "typeorm";
import {Paciente} from "./entity/Paciente";
import {Bioquimico} from "./entity/Bioquimico";
import {Exame} from "./entity/Exame";
import {Laboratorio} from "./entity/Laboratorio";
import fs = require('fs');
let parser = require('xml2json');

let JSONDBData = [];
let databaseDescription =  ['pacientes','bioquimicos','laboratorios','exames'];

createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "dbtypeorm",
    synchronize: true,
    entities: [
       "src/entity/*.ts"
    ],
}).then(async connection => {

    console.log("Inserindo dados no banco de dados...");    

     const paciente1 = new Paciente();
     paciente1.nome = "Gisela";
     paciente1.sobrenome = "Miranda";
     paciente1.cpf = 123456789;
     paciente1.email = "gisela_difini@hotmail.com";
     paciente1.telefone = 984280979;
     paciente1.endereco = "Arnaldo da Costa Bard 3129, apto 801";
    
     const paciente2 = new Paciente();
     paciente2.nome = "Leonardo";
     paciente2.sobrenome = "Felix";
     paciente2.cpf = 8372013741;
     paciente2.email = "leofelix@hotmail.com";
     paciente2.endereco = "Universidade do Vale do Rio dos Sinos";    

    const pacienteRepository = connection.getRepository(Paciente);
     await pacienteRepository.save(paciente1);
     await pacienteRepository.save(paciente2);
     console.log("Pacientes foram salvos!");

     const exameP1 = new Exame();
     exameP1.tipos = "Sangue, Colesterol, Glicose, Albumina";
     exameP1.CRMmedico = 2546;
     exameP1.paciente = paciente1;    
    
     const exameP1_2 = new Exame();
     exameP1_2.tipos = "Urina, Fezes";
     exameP1_2.CRMmedico = 2546;
     exameP1_2.paciente = paciente1;

     const exameP2 = new Exame();
     exameP2.tipos = "Sangue, Colesterol, Glicose, Urina";
     exameP2.CRMmedico = 2238;
     exameP2.paciente = paciente2;

    const exameRepository = connection.getRepository(Exame);
     await exameRepository.save(exameP1);
     await exameRepository.save(exameP1_2);
     await exameRepository.save(exameP2);
     console.log("Exames foram salvos!");

     const bioquimico1 = new Bioquimico();
     bioquimico1.CRQ = 4465;
     bioquimico1.nome = "Thomas";
     bioquimico1.sobrenome = "Miller";
     bioquimico1.salario = 3200.00;
     bioquimico1.especialidade = "Sangue, Colesterol, Glicose, Albumina";
     bioquimico1.exames = [exameP1, exameP2];
    
     const bioquimico2 = new Bioquimico();
     bioquimico2.CRQ = 4278;
     bioquimico2.nome = "Osvaldo";
     bioquimico2.salario = 2200.00;
     bioquimico2.especialidade = "Urina";
     bioquimico2.exames = [exameP2, exameP1_2];

     const bioquimico3 = new Bioquimico();
     bioquimico3.CRQ = 2118;
     bioquimico3.nome = "Vicente";
     bioquimico3.sobrenome = "Kayser";
     bioquimico3.salario = 4200.00;
     bioquimico3.especialidade = "Fezes";
     bioquimico3.exames = [exameP1_2];

    const bioquimicoRepository = connection.getRepository(Bioquimico);
     await bioquimicoRepository.save(bioquimico1);
     await bioquimicoRepository.save(bioquimico2);
     await bioquimicoRepository.save(bioquimico3);
     console.log("Bioquimicos foram salvos!");

     const lab = new Laboratorio();
     lab.nome = "Laboratório Bom Pastor";
     lab.cidade = "Taquara";
     lab.endereco = "Ed Fleming, R. Arnaldo da Costa Bard, 2940 - 101 - Centro";
     lab.telefone = 35421939;
     lab.bioquimicos = [bioquimico1, bioquimico2, bioquimico3];
    
    const laboratorioRepository = connection.getRepository(Laboratorio);
     await laboratorioRepository.save(lab);
     console.log("Laboratorios foram salvos!");

    const [exames, countExames] = await exameRepository.findAndCount({relations: ["paciente", "bioquimicos"]});
    const [pacientes, countPacientes] = await pacienteRepository.findAndCount({relations: ["exames"]});
    const [bioquimicos, countBioquimicos] =  await bioquimicoRepository.findAndCount({relations: ["exames", "laboratorio"]});
    const [laboratorios, countLaboratorios] =  await laboratorioRepository.findAndCount({relations: ["bioquimicos"]}); 

    console.log("Carregando dados do Banco de Dados...");
    console.log("Pacientes: ", pacientes);
    console.log("Bioquimicos: ", bioquimicos);
    console.log("Laboratorio: ", laboratorios);
    console.log("Exames: ", exames);
    console.log("TOTAIS:");
    console.log("Pacientes: ", countPacientes);
    console.log("Exames: ", countExames);
    console.log("Bioquimicos: ", countBioquimicos);
    console.log("Laboratorios: ", countLaboratorios+'\n\n');

    const pacienteUnimed = await pacienteRepository.find({where: {convenio: "unimed"}, take: 1 });

    const salarioMedio = await bioquimicoRepository.find({
        salario: Between(2000, 4000)
    });
    //SELECT * FROM "bioquimico" WHERE "salario" BETWEEN 2000 AND 4000

    console.log("Pacientes Unimed: " + pacienteUnimed + '\n');
    console.log("Salário Bioquímico entre 2000 e 4000: " + salarioMedio);


    let exameToRemove = await exameRepository.findOne(1);
    await exameRepository.remove(exameToRemove);
    console.log('Exame Removido do Banco: \n\n' + JSON.stringify(exameToRemove));

    writeDatabaseToJSON([pacientes,bioquimicos,laboratorios,exames], databaseDescription);
    writeDatabaseToXML([pacientes,bioquimicos,laboratorios,exames], databaseDescription);
    
}).catch(error => console.log(error));

function writeDatabaseToJSON(databaseData:any,dBDescription:any){
    let i = 0;
    databaseData.forEach(tableData => {
        fs.writeFile(dBDescription[i] + '.json', JSON.stringify(tableData) , (err) => {
            if (err) {
                throw err;
            }
            console.log('The JSON file has been saved!>>>>' + dBDescription[i++] + '.json');
        });            
    });
}

function writeDatabaseToXML(databaseData:any, dBDescription:any){
    let i = 0;
    databaseData.forEach(tableData => {
        fs.writeFile(dBDescription[i] + '.xml', json2xml(JSON.parse(JSON.stringify(tableData)),'')
                                                                .replace('<0>','<?xml version="1.0" encoding="UTF-8" standalone="no" ?><0>')
                                                                .replace(/[<][0-9][>]/gm,'<'+(dBDescription[i]).substring(0,4)+'>')
                                                                .replace(/[</][0-9][>]/gm,'/'+(dBDescription[i]).substring(0,4)+'>'), (err) => {
            if (err) throw err;
          });            
          console.log('The XML file has been saved!>>>>' + dBDescription[i++] + '.xml');
        });
}

function json2xml(o, tab) {
    var toXml = function(v, name, ind) {
       var xml = "";
       if (v instanceof Array) {
          for (var i=0, n=v.length; i<n; i++)
             xml += ind + toXml(v[i], name, ind+"\t") + "\n";
       }
       else if (typeof(v) == "object") {
          var hasChild = false;
          xml += ind + "<" + name;
          for (var m in v) {
             if (m.charAt(0) == "@")
                xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
             else
                hasChild = true;
          }
          xml += hasChild ? ">" : "/>";
          if (hasChild) {
             for (var m in v) {
                if (m == "#text")
                   xml += v[m];
                else if (m == "#cdata")
                   xml += "<![CDATA[" + v[m] + "]]>";
                else if (m.charAt(0) != "@")
                   xml += toXml(v[m], m, ind+"\t");
             }
             xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
          }
       }
       else {
          xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
       }
       return xml;
    }, xml="";
    for (var m in o)
       xml += toXml(o[m], m, "");
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
 }