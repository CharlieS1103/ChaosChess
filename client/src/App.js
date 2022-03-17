
import styled from "styled-components";
const chaosChess = () => {

  const joinGravity = () => {
      window.location.replace("/gravity")
  }
  const joinFlipped = () => {
      window.location.replace("/flipped")
  }
  const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;
  return (
    <>
      <h1>Chaos Chess</h1>
      <Button onClick={() => {
        joinGravity()
      }}>Join Gravity Chess</Button>
      <Button onClick={() => {
        joinFlipped()
      }}>Join Flipped Chess</Button>
    </>
   
  )
}

export default chaosChess;
