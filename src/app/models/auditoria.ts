export class Auditoria {
  constructor(
    public idLog: number,
    public idUsuario: number,
    public accion: string,
    public tablaAfectada: string,
    public idRegistroAfectado: number,
    public fechaHora: string,
    public ipCliente: string,
  ) {}
}
