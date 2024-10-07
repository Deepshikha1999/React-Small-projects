import './CoreConcepts.css';

// function CoreConcepts(props){
export default function CoreConcepts({ title, image, description }) {
    return (
        <li>
            <img src={image} alt={title} width="100" height="100" />
            <h3>{title}</h3>
            <p>{description}</p>
        </li>
    );
}