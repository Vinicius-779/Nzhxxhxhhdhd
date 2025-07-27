enum Motor {
    //% block="Motor A"
    A,
    //% block="Motor B"
    B,
    //% block="Ambos"
    Ambos
}

enum Sentido {
    //% block="Esquerda"
    Esquerda,
    //% block="Direita"
    Direita
}

//% color=#FF0000 icon="⚙️" block="L298N" weight=100
namespace L298N {
    let velocidade = 800
    let tempo360 = 800 // tempo em ms para girar 360°

    const IN1 = DigitalPin.P13
    const IN2 = DigitalPin.P14
    const IN3 = DigitalPin.P15
    const IN4 = DigitalPin.P16

    //% block="definir velocidade padrão para %v"
    //% v.min=0 v.max=1023
    export function definirVelocidade(v: number): void {
        velocidade = Math.clamp(0, 1023, v)
    }

    //% block="calibrar tempo para girar 360° para %tempo ms"
    //% tempo.min=100 tempo.max=5000
    export function calibrarTempoGiro360(tempo: number): void {
        tempo360 = tempo
    }

    function ativarMotor(motor: Motor, pin1: number, pin2: number): void {
        pin1 = Math.clamp(0, 1023, pin1)
        pin2 = Math.clamp(0, 1023, pin2)
        switch (motor) {
            case Motor.A:
                pins.analogWritePin(IN1, pin1)
                pins.analogWritePin(IN2, pin2)
                break
            case Motor.B:
                pins.analogWritePin(IN3, pin1)
                pins.analogWritePin(IN4, pin2)
                break
            case Motor.Ambos:
                pins.analogWritePin(IN1, pin1)
                pins.analogWritePin(IN2, pin2)
                pins.analogWritePin(IN3, pin1)
                pins.analogWritePin(IN4, pin2)
                break
        }
    }

    //% block="motor %motor para frente"
    export function frente(motor: Motor): void {
        ativarMotor(motor, velocidade, 0)
    }

    //% block="motor %motor para trás"
    export function re(motor: Motor): void {
        ativarMotor(motor, 0, velocidade)
    }

    //% block="parar motor %motor"
    export function parar(motor: Motor): void {
        ativarMotor(motor, 0, 0)
    }

    //% block="virar para %lado"
    export function virar(lado: Sentido): void {
        if (lado == Sentido.Esquerda) {
            ativarMotor(Motor.A, 0, velocidade)
            ativarMotor(Motor.B, velocidade, 0)
        } else {
            ativarMotor(Motor.A, velocidade, 0)
            ativarMotor(Motor.B, 0, velocidade)
        }
        basic.pause(tempo360 / 4)
        parar(Motor.Ambos)
    }

    //% block="girar %graus ° para %lado"
    export function girarGraus(graus: number, lado: Sentido): void {
        const tempo = (graus / 360) * tempo360
        virar(lado)
        basic.pause(tempo)
        parar(Motor.Ambos)
    }
}