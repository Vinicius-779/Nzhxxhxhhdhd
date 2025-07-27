// Enumeração para seleção de motor
enum SelecionarMotor {
    //% block="A (IN1/IN2)"
    A,
    //% block="B (IN3/IN4)"
    B,
    //% block="Ambos"
    Ambos
}

// Enumeração para direção
enum Direcao {
    //% block="Esquerda"
    Esquerda,
    //% block="Direita"
    Direita
}

//% color=#FF0000 weight=100 icon="\uf085" block="L298N"
namespace L298N {
    let velocidade = 800
    let tempoGiroCompleto = 800 // Tempo estimado para giro de 360°

    // Pinos fixos
    const IN1 = DigitalPin.P13
    const IN2 = DigitalPin.P14
    const IN3 = DigitalPin.P15
    const IN4 = DigitalPin.P16

    //% block="definir velocidade padrão %v"
    //% v.min=0 v.max=1023
    export function definirVelocidade(v: number): void {
        velocidade = Math.clamp(0, 1023, v)
    }

    //% block="definir tempo para giro 360° %ms ms"
    //% ms.min=100 ms.max=5000
    export function calibrarGiro360(ms: number): void {
        tempoGiroCompleto = ms
    }

    function ativarMotores(motor: SelecionarMotor, v1: number, v2: number): void {
        if (motor == SelecionarMotor.A || motor == SelecionarMotor.Ambos) {
            pins.analogWritePin(IN1, v1)
            pins.analogWritePin(IN2, v2)
        }
        if (motor == SelecionarMotor.B || motor == SelecionarMotor.Ambos) {
            pins.analogWritePin(IN3, v1)
            pins.analogWritePin(IN4, v2)
        }
    }

    //% block="motor %motor para frente"
    export function frente(motor: SelecionarMotor): void {
        ativarMotores(motor, velocidade, 0)
    }

    //% block="motor %motor para trás"
    export function re(motor: SelecionarMotor): void {
        ativarMotores(motor, 0, velocidade)
    }

    //% block="parar motor %motor"
    export function parar(motor: SelecionarMotor): void {
        ativarMotores(motor, 0, 0)
    }

    //% block="virar para %direcao usando %motor"
    export function virar(direcao: Direcao, motor: SelecionarMotor): void {
        if (direcao == Direcao.Esquerda) {
            if (motor == SelecionarMotor.Ambos) {
                ativarMotores(SelecionarMotor.A, 0, velocidade)
                ativarMotores(SelecionarMotor.B, velocidade, 0)
            } else {
                ativarMotores(motor, 0, velocidade)
            }
        } else {
            if (motor == SelecionarMotor.Ambos) {
                ativarMotores(SelecionarMotor.A, velocidade, 0)
                ativarMotores(SelecionarMotor.B, 0, velocidade)
            } else {
                ativarMotores(motor, velocidade, 0)
            }
        }
        basic.pause(tempoGiroCompleto / 4)
        parar(motor)
    }

    //% block="girar %graus ° para %direcao usando %motor"
    export function girarGraus(graus: number, direcao: Direcao, motor: SelecionarMotor): void {
        const tempo = (graus / 360) * tempoGiroCompleto
        virar(direcao, motor)
        basic.pause(tempo)
        parar(motor)
    }
}
