import {Entity, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { Laboratorio } from "./Laboratorio";
import { Exame } from "./Exame";

@Entity()
export class Bioquimico {

    @PrimaryColumn()
    CRQ: number;

    @Column({length: 100})
    nome: string;

    @Column({length: 100, nullable: true})
    sobrenome: string;

    @Column("double")
    salario: number;

    @Column({nullable: true})
    especialidade: string;

    @ManyToOne(type => Laboratorio, laboratorio => laboratorio.bioquimicos)
    laboratorio: Laboratorio;

    @ManyToMany(type => Exame, exame => exame.bioquimicos)
    @JoinTable()
    exames: Exame[];
}
