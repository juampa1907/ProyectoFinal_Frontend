export class Partido {
  constructor(
    public idPartido: number,
    public idEquipoLocal: number,
    public idEquipoVisitante: number,
    public fase: string,
    public golesLocal: number,
    public golesVisitante: number,
    public fechaHora: string,
    public estado: string,
  ) {}
}
