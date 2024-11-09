export class Robot {
    usuario: string;
    bateria: number;
    funcionalidades: string[] = ['parlantes','wifi','bluetooth'];

    constructor(
        usuario: string,
    ) {
        this.usuario = usuario;
        this.bateria = 100;
    }

    encender(): void {
        if (this.bateria > 0) {
            console.log(`Hola ${this.usuario}`);
            this.bateria -= 0.125;
        } else
            this.mostrarErrorBateria();
    }

    lavar():void {
        if (this.bateria)
            this.bateria -= 1;
        else
            this.mostrarErrorBateria();
    }

    mostrarErrorBateria(): void {
        console.error('Sin batería');
    }
}