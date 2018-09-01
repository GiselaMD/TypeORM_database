import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany} from "typeorm";
import { Paciente } from "./Paciente";
import { Bioquimico } from "./Bioquimico";

@Entity()
export class Exame {

    @PrimaryGeneratedColumn()
    numExame: number;

    @Column()
    tipos: string;

    @Column()
    CRMmedico: number;

    @ManyToOne(type => Paciente, paciente => paciente.exames)
    paciente: Paciente;

    @ManyToMany(type => Bioquimico, bioquimico => bioquimico.exames)
    bioquimicos: Bioquimico[];
}
