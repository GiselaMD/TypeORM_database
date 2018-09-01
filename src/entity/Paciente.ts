import {Entity, PrimaryColumn, Column, OneToMany, Index} from "typeorm";
import { Exame } from "./Exame";

@Entity()
@Index(["nome", "sobrenome"], { unique: true })
export class Paciente {

    @PrimaryColumn("decimal")
    cpf: number;

    @Column({length: 100})
    nome: string;

    @Column({length: 100})
    sobrenome: string;

    @Column({default: 'unimed'})
    convenio: string;

    @Column()
    email: string;

    @Column({nullable: true})
    telefone: number;

    @Column()
    endereco: string;

    @OneToMany(type => Exame, exame => exame.paciente)
    exames: Exame[];
}
