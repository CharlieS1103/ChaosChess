import React from 'react';
import styled from 'styled-components';
export default class Rules extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            
        };
    }
    render() {
        return(
             <>
            <body>
            <div className="rules-container">
                <h1>Rules</h1>
                <GravityRules className="gravity-container">
                <h2>Gravity Chess Rules</h2>
                <p>
                Gravity Chess is a chess variant that makes pieces fall towards their own sides
                when an empty space is below them.
                </p>
                </GravityRules>
            </div>
            </body>
        </>)

    }
  
} 
const GravityRules = styled.div`
    
    `;