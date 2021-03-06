import { Command } from "@main/classes/Command";
import { Logger } from "@main/logger";
import { ServerData } from "@main/serverdata";

import os from "os";
import path from "path";
import fs from "fs";
const	logger = new Logger("RunClientCommand")
const	port = ServerData.getInstance().settings.port
import child_process from "child_process";
export default class RunClientCommand extends Command {
	public readonly name: string = "runclient";
	private args: Array<string>;
	run(args?: any) {
		var discordpath;
		logger.info("Starting " + os.platform() + " client.");
		switch (os.platform()) {
			case "linux":
				discordpath = "discord";
				break;
			case "win32":
				var base = process.env.LOCALAPPDATA + "\\Discord";
				var newestdiscord = null;
				fs.readdirSync(base)
					.sort()
					.forEach((value) => {
						if (newestdiscord != null) return;
						if (value.includes("app-")) {
							newestdiscord = value;
						}
					});
				discordpath = path.resolve(`${base}\\${newestdiscord}\\Discord.exe`);
				break;
		}
		child_process.exec(
			discordpath + " " + this.args.toString().replace(/,/g, " ")
		);
	}
	constructor() {
		super();
		this.args = [
			`--host-rules="MAP discord.com 127.0.0.1:${port}"`,
			"--ignore-certificate-errors",
			"--allow-insecure-localhost",
			"--disable-http-cache",
		];
	}
}
