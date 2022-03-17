import React from 'react';
import styled from 'styled-components';
export default class Rules extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            
        };
    }
    componentDidMount() {
        console.log("Component did mount")
        document.body.style.backgroundColor = "#151E3F";
        document.body.style.color = "#7FC29B";
    }
    render() {
        return(
             <>
            <body>
                <Head>Rules</Head>
            <RulesContainer className="rules-container">
                
                <RulesBox className="gravity-container">
                <h2>Gravity Chess Rules</h2>
                <p>
                Gravity Chess is a chess variant that makes pieces fall towards their own sides
                when an empty space is below them.
                </p>
                <h3>The Game</h3>
                <StyledList>
                <li>
                
                <p>
                Queens are unable to take pawns in this gamemode
                </p>
                </li>
                <li>
                <p>
                Rooks, Kings, and Pawns are unaffected by Gravity
                </p>
                </li>
                <li>
                <p>
                When you have a piece on your opponents backrank, it is also unaffected by Gravity
                </p>
                </li>

                </StyledList>
                </RulesBox>
                <RulesBox className="flipped-container">
                <h2>Flipped Chess Rules</h2>
                <p>
                    Flipped Chess is a chess variant where the backrow and frontrow are swapped.
                </p>
                </RulesBox>
            </RulesContainer>
            </body>
        </>)

    }
  
} 
const Head = styled.h1`
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 50px;
    color: #f5f5f5;
    background-color: #030027;
    padding: 20px;
    margin: 0px;
`
const RulesBox = styled.div`
    margin: 10px;
    padding: 10px;
    border: solid 4px #7FC29B;
    border-radius: 10px;
    background-color: #030027;
    color: #7FC29B;
    text-align: center;

    `;
const RulesContainer = styled.div`
             display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
`;
const StyledList = styled.ul`
    list-style-type: none;
`;
