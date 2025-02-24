import { MultiSteps } from "../components/MultiSteps";

export default function Creator() {
    return (
        <MultiSteps>
            {(next) => <button onClick={() => next()}>Page 1</button>}
            {(next) => <button onClick={() => next()}>Page 2</button>}
            {() => <button>Page 3</button>}
        </MultiSteps>
    );
}
