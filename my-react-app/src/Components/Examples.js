import { EXAMPLES } from "../Assests/data";
import { useState } from 'react';
import TabButton from "./TabButton";
import Section from "./Section";
import Tabs from "./Tabs";

export default function Examples() {
    // const [selectedTopics, setSelectedTopics] = useState('Please click a button');//returns 2 elements
    const [selectedTopics, setSelectedTopics] = useState();//returns 2 elements

    // let tabContent = 'Please click a Button';
    function handleSelect(selectedButton) {
        //selectedButton => 'Components,''jsx','props','state'
        // console.log("hello world -- selected",selectedButton);
        setSelectedTopics(selectedButton);
        console.log(selectedTopics)
        // console.log("hello world -- selected",tabContent);
    }

    let tableContent = <p className="nothing">Please click the button</p>;
    if (selectedTopics) {
        tableContent = (
            <div className="content">
                <h3>{EXAMPLES[selectedTopics].title}</h3>
                <p>
                    {EXAMPLES[selectedTopics].description}
                </p>
                <pre>
                    {EXAMPLES[selectedTopics].code}
                </pre>
            </div>
        )
    }
    return (
        <Section title="Examples" id="examples">
            {/* <h2 class="tempHeader">Examples</h2> */}
            <menu className="menu">
                {/* onSelect={() => handleSelect('components')} */}
                <TabButton isSelected={selectedTopics === 'components'} onClick={() => handleSelect('components')}><h4>Components</h4></TabButton>
                <TabButton isSelected={selectedTopics === 'jsx'} onClick={() => handleSelect('jsx')}><h4>JSX</h4></TabButton>
                <TabButton isSelected={selectedTopics === 'props'} onClick={() => handleSelect('props')}><h4>Props</h4></TabButton>
                <TabButton isSelected={selectedTopics === 'state'} onClick={() => handleSelect('state')}><h4>State</h4></TabButton>
                {/* <TabButton onSelect={handleSelect}><h4>Empty</h4></TabButton> */}
            </menu>
            {/* Dynamic Content */}
            {/* <div class="content">{selectedTopics}</div> */}


            {/** Approach 1 to render content if no values or empty values are there 
        {!selectedTopics ? <p class="nothing">Please click the button</p> :
          <div class="content">
            <h3>{EXAMPLES[selectedTopics].title}</h3>
            <p>
              {EXAMPLES[selectedTopics].description}
            </p>
            <pre>
              {EXAMPLES[selectedTopics].code}
            </pre>
          </div>}*/}

            {/** Approach 2 to render content if no values or empty values are there 
          {!selectedTopics && <p class="nothing">Please click the button</p>}
          {selectedTopics &&
          <div class="content">
            <h3>{EXAMPLES[selectedTopics].title}</h3>
            <p>
              {EXAMPLES[selectedTopics].description}
            </p>
            <pre>
              {EXAMPLES[selectedTopics].code}
            </pre>
          </div>}*/}

            {/** Approach 2 to render content if no values or empty values are there */}
            {tableContent}

            {/* <Tabs className = "menu" Button={
            <>
                <TabButton isSelected={selectedTopics==='components'} onClick={() => handleSelect('components')}><h4>Components</h4></TabButton>
                <TabButton isSelected={selectedTopics==='jsx'} onClick={() => handleSelect('jsx')}><h4>JSX</h4></TabButton>
                <TabButton isSelected={selectedTopics==='props'} onClick={() => handleSelect('props')}><h4>Props</h4></TabButton>
                <TabButton isSelected={selectedTopics==='state'} onClick={() => handleSelect('state')}><h4>State</h4></TabButton>
            </>
          }>
            {tableContent}
            </Tabs>          */}

            {/* <Tabs ButtonContainer="menu" className="menu" buttons={
                <>
                    <TabButton isSelected={selectedTopics === 'components'} onClick={() => handleSelect('components')}><h4>Components</h4></TabButton>
                    <TabButton isSelected={selectedTopics === 'jsx'} onClick={() => handleSelect('jsx')}><h4>JSX</h4></TabButton>
                    <TabButton isSelected={selectedTopics === 'props'} onClick={() => handleSelect('props')}><h4>Props</h4></TabButton>
                    <TabButton isSelected={selectedTopics === 'state'} onClick={() => handleSelect('state')}><h4>State</h4></TabButton>
                </>
            }>
                {tableContent}
            </Tabs> */}

            <Tabs className="menu" buttons={
                <>
                    <TabButton isSelected={selectedTopics === 'components'} onClick={() => handleSelect('components')}><h4>Components</h4></TabButton>
                    <TabButton isSelected={selectedTopics === 'jsx'} onClick={() => handleSelect('jsx')}><h4>JSX</h4></TabButton>
                    <TabButton isSelected={selectedTopics === 'props'} onClick={() => handleSelect('props')}><h4>Props</h4></TabButton>
                    <TabButton isSelected={selectedTopics === 'state'} onClick={() => handleSelect('state')}><h4>State</h4></TabButton>
                </>
            }>
                {tableContent}
            </Tabs>

        </Section>
    )
}