export class Usuario {
    constructor(public id : number, public username : string, public password : string, public nombreApellido : string, public idRol : number, public estado : string, public intentos : number, public fechaUltClave : string){}
}
