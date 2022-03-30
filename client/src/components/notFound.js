import React from 'react';
import styled from "styled-components";
export default class notFound extends React.Component{
    render(){
        return(
            <div>
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <HomeButton></HomeButton>
            </div>
        )
    }
}
function HomeButton(props) {
    return (
        <>
            <Button className="home-button" onClick={() => {
                window.location.href = "/"
            }
            }>Home</Button>
        </>
    )
}
const Button = styled.button`
  background-color: #747578;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 10px;
  margin: 10px 0px;
  z-index: 2;
  cursor: pointer;
  border: solid 4px #7FC29B;
`;