import CoreConcepts from "./CoreConcepts";
import { CORE_CONCEPTS } from "../Assests/data";

export default function CoreConceptsDetails (){ 
    return (
        <section id="core-concepts">
        <ul>
          {CORE_CONCEPTS.map(item=>{
            // return (<CoreConcepts {...item}/>)
            return (<CoreConcepts key={item.title} {...item}/>)
          })}
          {/* <CoreConcepts title={CORE_CONCEPTS[0].title} image={CORE_CONCEPTS[0].image} description={CORE_CONCEPTS[0].description} />
          <CoreConcepts {...CORE_CONCEPTS[1]} />
          <CoreConcepts {...CORE_CONCEPTS[2]} />
          <CoreConcepts {...CORE_CONCEPTS[3]} /> */}
        </ul>
      </section>
    )
}