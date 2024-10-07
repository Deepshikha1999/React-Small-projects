// export default function TabButton({children,onSelect,isSelected}) {
export default function TabButton({children,isSelected,...props}) {

    function handleClick(){
        console.log("hello world");
    }
    return (<li>
        {/* <button onClick={handleClick}>{children}</button> */}
        <button className={isSelected? 'active' : undefined} {...props}>{children}</button>
    </li>);
}