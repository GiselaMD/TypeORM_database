import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Bioquimico } from "./Bioquimico";

@Entity()
export class Laboratorio {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({length: 100})
    cidade: string;

    @Column()
    endereco: string;

    @Column()
    telefone: number;

    @OneToMany(type => Bioquimico, bioquimico => bioquimico.laboratorio)
    bioquimicos: Bioquimico[];
}
