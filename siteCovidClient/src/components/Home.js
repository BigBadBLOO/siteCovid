import React, {createRef, useState} from "react";
import Button from "./Button";
import Header from "./Header";
import {connect} from "react-redux";
import ListOfPerson from "./ListOfPerson";
import MakeReport from "./MakeReport";
import SeeReport from "./SeeReport";
import ListForEntering from "./ListForEntering";
import Loader from "./Loader";
import MainPageForCenter from "./MainPageForCenter";
import ListOfPost from "./ListOfPost";


function Home({user}) {
  const [showBody, setShowBody] = useState('nothing');
  const headerRef = createRef();

  const mainButton = <MainPageForCenter setShowBody={setShowBody}/>;

  const bodyForCentre = () => {
    switch (showBody) {
       case 'listOfPost':
        return (<ListOfPost setShowBody={setShowBody}/>);
      case 'listOfPerson':
        return (<ListOfPerson setShowBody={setShowBody}/>);
      case 'makeReport':
        return (<MakeReport setShowBody={setShowBody}/>);
      case 'listForEntering':
        return (<ListForEntering headerRef={headerRef} setShowBody={setShowBody}/>);
      case 'report':
        return (<SeeReport user={user} headerRef={headerRef} setShowBody={setShowBody}/>);
      default:
        return (mainButton)
    }
  };

  const mainButtonForControl = (
    <div>
      <Button className="" type='primary' text="Списки на проход" onClick={() => {
        setShowBody('listForEntering')
      }}/>
      <Button className="" type='primary' text="Справка доклад" onClick={() => {
        setShowBody('report')
      }}/>
    </div>
  );

  const bodyForControl = () => {
    switch (showBody) {
      case 'listForEntering':
        return (<ListForEntering headerRef={headerRef} setShowBody={setShowBody}/>);
      case 'report':
        return (<SeeReport user={user} headerRef={headerRef} setShowBody={setShowBody}/>);
      default:
        return (mainButtonForControl)
    }
  };

  return (
    <>
      <Header headerRef={headerRef}/>
      <div className="px-2">
        {user['is_control']
          ? bodyForControl()
          : bodyForCentre()
        }
      </div>
      <Loader/>
    </>
  )
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(Home)