import React, { useState } from "react";
import {
  ConnectWalletIcon,
  LoginBgcIcon,
  LoginCenterIcon,
  TipIcon,
} from "../../icons";

import "./index.scss";
import { MetamaskActions, useSnapClient } from "../../hooks/useSnapClient";
import { useIonLoading } from "@ionic/react";
import { useStore } from "../../services/mobx/service";
import { observer } from "mobx-react";
import { Button } from "../../components/Button";
import { SignIn, SignUp } from "../../components/LoginModal";
import { RenderWalletAddressBox } from "../../components/LoginModal/WalletAddressBox/WalletAddressBox";
import { Modal } from "../../components/Modal";
import { useConnectMQ } from "../../hooks/useLogin";

interface IProps {}

const Login: React.FC<IProps> = () => {
  const { state: { isFlask } } = useSnapClient();
  const store = useStore();
  const [present, dismiss] = useIonLoading();
  const [errorInfo, setErrorInfo] = useState("");
  const { dispatch } = useSnapClient()
  const { detectUser, connect, signUpAndConnect} = useConnectMQ()
  const [signInVisible, setSignInVisible] = useState<boolean>(false)
  const [signUpVisible, setSignUpVisible] = useState<boolean>(false)
  const [address, setAddress] = useState<string>('')
  const [userid, setUserid] = useState<string>('')

  const onConnectClick = async () => {
    await present({
      message: "Connecting...",
      spinner: "circles",
    });
    try {
      const { userExist, userid, address } = await detectUser()
      if (!address || !userid) {
        return
      }
      setAddress(address)
      setUserid(userid)
      if (userExist) {
        setSignInVisible(true)
        return
      }
      setSignUpVisible(true)
    } finally {
      await dismiss()
    }
  }

  const onSignUpSubmit = async (password: string) => {
    if (!password) {
      return
    }
    try {
      await present({
        message: "Connecting...",
        spinner: "circles",
      });
      const res = await signUpAndConnect({
        userid,
        password,
        address,
      })
      console.log(res, 'onSignUpSubmit')
      store.setIsConnected(true);
      dispatch({
        type: MetamaskActions.SetConnected,
        payload: true,
      })
    } finally {
      await dismiss()
      setSignUpVisible(false)
    }
  }

  const onSignInSubmit = async (password: string) => {
    if (!password) {
      return
    }
    try {
      const res = await connect({
        userid,
        password,
        address,
      })
      console.log(res, 'onSignInSubmit')
      store.setIsConnected(true);
      dispatch({
        type: MetamaskActions.SetConnected,
        payload: true,
      })
    } finally {
      setSignInVisible(false)
    }
  }


  return (
    <div className="login_container">
      <div className="test-bgc">
        <LoginBgcIcon />
      </div>
      <div className="connectBtnBox">
        <LoginCenterIcon />
        <div className="connectBtnBoxTitle">Welcome to Snap</div>
        <div className="connectBtnBoxText">
          Let's get started with your decentralized trip now!
        </div>
        <div className="walletConnect-btnBox">
          <Button
            icon={<ConnectWalletIcon />}
            className={"channelBtn"}
            onClick={onConnectClick}
            title="Connect to Web3MQ"
          />
        </div>
        {!isFlask && (
          <div className="notInstalled">
            <TipIcon />
            <p>
              Not installed MetaMask Flask{" "}
              <a
                className="ephasis"
                href="https://metamask.io/flask/"
                target="_blank"
                rel="noreferrer"
              >
                install MetaMask Flask
              </a>
            </p>
          </div>
        )}
      </div>
      <Modal visible={signUpVisible} closeModal={() => setSignUpVisible(false)}>
        <div className="modalBody">
          <SignUp
            showLoading={false}
            errorInfo={errorInfo}
            submitSignUp={onSignUpSubmit}
            addressBox={<RenderWalletAddressBox address={address} />}
          />
        </div>
      </Modal>
      <Modal visible={signInVisible} closeModal={() => setSignInVisible(false)}>
        <div className="modalBody">
          <SignIn
            showLoading={false}
            errorInfo={errorInfo}
            submitLogin={onSignInSubmit}
            addressBox={<RenderWalletAddressBox address={address} />}
          />
        </div>
      </Modal>
    </div>
  );
};

export default observer(Login);