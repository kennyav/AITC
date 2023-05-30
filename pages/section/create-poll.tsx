import UserSideMenu from "@/components/UserSideMenu";
import { useNostrConnection } from "@/context/use-nostr-connection";
import { useState } from "react";
var CryptoJS = require("crypto-js");

export default function Interests() {
	const { connection: nostrConnection } = useNostrConnection();
	const [encryptedKey, setEncryptedKey] = useState<string>();

	// useEffect(() => {
	// 	if (!nostrConnection) return;
	// 	if (nostrConnection.type === "generated-keys" || nostrConnection.type === "inputted-keys") {
	// 		setEncryptedKey(CryptoJS.AES.encrypt(nostrConnection.prvkey, 'AITCSunrise').toString());
	// 		console.log("encryptedKey", encryptedKey);
	// 	}
	// }, [nostrConnection]);

	const handlePageClick = (interest: string) => {
		if (nostrConnection?.type === "generated-keys" || nostrConnection?.type === "inputted-keys") {
			var encrypted = CryptoJS.AES.encrypt(nostrConnection.prvkey, 'AITCSunrise').toString();
			// TODO: replace all non string characters with a sequence of characters that can be parsed
			var encryptedWithoutBackslashes = encrypted.replace(/\//g, '?');
			setEncryptedKey(encryptedWithoutBackslashes);
			console.log("click encryptedKey", encryptedKey);
		}
		window.open(`https://aitc-polling.vercel.app/boardroom/${interest.toLowerCase()}/${encryptedKey}`, "_blank");
	};

	const interestList: string[] = [
		"Animals",
		"Art",
		"Electronics",
		"Finance",
		"Politics",
		"Travel"]

	return (
		<div className="flex flex-col gap-3 justify-center items-center">
			<img className="w-32 h-auto pt-4" src="/AITCMainLogo.png" alt="" />
			<h1 className="text-4xl text-center font-bold text-white">What are you interested in?</h1>
			<div className="flex flex-col h-screen w-full items-center">
				<div className="grid grid-cols-3 grid-flow-row gap-4 w-2/3">
					{interestList.map((interest) => (
						<button
							key={interest}
							className="text-white text-center font-medium relative rounded-xl h-full w-full hover:opacity-60"
							onClick={() => handlePageClick(interest)}
						>
							<h1 className="absolute inset-0 flex items-center justify-center text-center lg:text-4xl md:text-xl sm:text-m">
								{interest}
							</h1>
							<img
								className="object-cover h-full w-full rounded-xl"
								src={`/${interest}.png`}
								alt=""
							/>
						</button>
					))}
				</div>
			</div>
			<UserSideMenu isOpen={false} />
		</div>
	);

}