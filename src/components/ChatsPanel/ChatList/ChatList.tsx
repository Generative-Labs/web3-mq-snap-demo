import { useState } from "react";

import {
  IonIcon,
  IonInput,
  useIonLoading,
} from "@ionic/react";

import {
  chevronDownOutline,
  searchOutline,
} from "ionicons/icons";
import { observer } from "mobx-react";

import "./ChatList.scss";
import { useSnaps } from "../../../hooks/useSnaps";
import { getAddressByDids } from "../../../services/utils/utils";
import { ChatIcon } from "../../../icons";
import { EmptyList } from "../../../EmptyList";
import { Button } from "../../Button";

export enum STARCH_TYPE {
  WALLET = "Wallet",
  DOTBIT = "Dot.Bit",
  ENS = "ENS",
}



const ChatList = () => {
  const [present, dismiss] = useIonLoading();
  const { getUserId } = useSnaps();
  const [readySendMessage, setReadySendMessage] = useState("");
  const [searchType, setSearchType] = useState<STARCH_TYPE>(STARCH_TYPE.WALLET);

  const searchTypes: STARCH_TYPE[] = [
    STARCH_TYPE.WALLET,
    STARCH_TYPE.DOTBIT,
    STARCH_TYPE.ENS,
  ];

  function onPullChats() {

  }

  return (
    <div className="mq-chats">
      <div className="searchUserBox">
        <div className="searchTypeBox">
          <div className="searchType">
            {searchType}
            <IonIcon
              style={{ color: "#000", fontSize: "14px" }}
              slot="icon-only"
              icon={chevronDownOutline}
            />
          </div>
          <div className="selectSearchType">
            <ul>
              {searchTypes.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearchType(item);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <IonInput
          className="input"
          value={readySendMessage}
          placeholder="Write a message"
          onIonChange={(e) => {
            setReadySendMessage(e.detail.value!);
          }}
        />
        <IonIcon
          className="searchButton"
          slot="icon-only"
          icon={searchOutline}
          onClick={async () => {
            console.log(readySendMessage, "readySendMessage");
            let address = readySendMessage;
            await present({ message: "Loading..." });
            if (searchType !== STARCH_TYPE.WALLET) {
              address = await getAddressByDids(searchType, readySendMessage);
            }
            console.log(address, "address");
            await getUserId(address);
            await dismiss();
          }}
        />
      </div>
      <div className="chatResult">
        <EmptyList icon={<ChatIcon />} title="Your message list is empty" />
      </div>
      <div>
        <Button className="bottomBtn" title={"Pull the latest status"} onClick={onPullChats} />
      </div>
    </div>
  );
};
export default observer(ChatList);