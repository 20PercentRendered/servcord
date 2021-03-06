import { Logger } from "@main/logger";
import { ServerData } from "@main/serverdata";
import { BaseModule } from "./modules/BaseModule";

export class Loader {
    private logger: Logger;
    async requestShutdown(reason) {
        var modulesToStop = [];
        ServerData.getInstance().modules.forEach(async (mod)=>{
            this.logger.info("Stopping "+mod.name || mod.intName)
            modulesToStop.push(this.stopModule(mod));
        })      
        Promise.all(modulesToStop).then((value)=>{
            process.exit(0);
        }).catch((e)=>{
            this.logger.warn("Some modules failed to stop gracefully.")
            process.exit(0);
        })
        // wait 5 seconds, and then force shutdown.
        setTimeout(() => {
            this.forceShutdown("Graceful shutdown failed.")
        }, 5000);
    }
    private stopModule(module: BaseModule): Promise<void> {
        return new Promise((resolve, reject)=>{
            module.stop(()=>{
                resolve();
            });
        })
    }
    forceShutdown(reason) {
        this.logger.info("A forced shutdown was executed. Data was not saved. Reason: "+reason)
        process.exit(1);
    }
    constructor () {
        this.logger = new Logger("Loader");
    }
}