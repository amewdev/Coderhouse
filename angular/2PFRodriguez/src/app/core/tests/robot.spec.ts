import { Robot } from "./robot"

describe("Pruebas de Robot",() => {
    let robot = new Robot("Matías");

    beforeEach(() => {
        robot = new Robot("Naruto");
    })


    it("Al instanciar el robot, se espera que tenga un usuario", () => {
        //const robot = new Robot("Matías");
        robot = new Robot("Matías");
        expect(robot.usuario).toBe("Matías");
    })

    it("Al instanciar el robot, se espera que tenga 100% de batería", () => {
        //const robot = new Robot("Jorge");
        robot = new Robot("Jorge");
        expect(robot.bateria).toBe(100);
        expect(robot.usuario).toBe("Jorge");
    })

    it("Al instanciar el robot, se espera que tenga las siguientes funcionalidades: 'wifi','bluetooth','parlantes'", () => {
        //const robot = new Robot("Naruto");
        expect(robot.funcionalidades).toContain('wifi');
        expect(robot.funcionalidades).toContain('bluetooth');
        expect(robot.funcionalidades).toContain('parlantes');
    })

    it("Cuando el robot se enciende, se espera que salude al usuario", () => {
        //const robot = new Robot("Naruto");
        const spyOnLog = spyOn(console,'log');

        robot.encender();

        expect(spyOnLog).toHaveBeenCalled();

        expect(spyOnLog).toHaveBeenCalledOnceWith('Hola Naruto');
    })
    /*
    it("Cuando el robot lava, se espera que la batería disminuya", () => {
        const robot = new Robot("Naruto");

        robot.encender();
        expect(robot.bateria).toBeLessThan(100);
    })
    */
    it("Si no hay batería, el robot no debería poder lavar", () => {
        //const robot = new Robot("Naruto");
        const spyOnMEB = spyOn(robot,'mostrarErrorBateria');

        robot.encender();
        robot.bateria = 0;
        robot.lavar();

        expect(spyOnMEB).toHaveBeenCalled();
    })
})