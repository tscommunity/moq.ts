import {Mock} from '../lib/mock';
import {It} from '../lib/expected-expressions/expression-predicates';
import {ExpectedGetPropertyExpression} from '../lib/expected-expressions/expected-expressions';
import {Times} from '../lib/times';
import {MockBehavior} from '../lib/interceptor-callbacks/interceptor-callbacks';

interface ITestObject {
    property: string;
}

describe('Mock: Get property', () => {


    it('Returns value with a simple setup', () => {
        const value = 'value';
        const object = new Mock<ITestObject>()
            .setup(instance => instance.property)
            .returns(value)
            .object();

        const actual = object.property;

        expect(actual).toBe(value);
    });


    it('Returns value with a predicated setup', () => {
        const value = 'value';

        const object = new Mock<ITestObject>()
            .setup(instance => It.Is((expression: ExpectedGetPropertyExpression) => expression.name === 'property'))
            .returns(value)
            .object();

        expect(object.property).toBe(value);
    });

    it('Returns undefined for unset property in strict mode', () => {
        const value = 'value';
        const object = new Mock<ITestObject>()
            .object();

        const actual = object.property;

        expect(actual).toBeUndefined();
    });

    it('Returns unset function for unset property in loose mode', () => {
        const value = 'value';
        const mock = new Mock<ITestObject>()
            .setBehaviorStrategy(MockBehavior.Loose);
        const object = mock.object();

        const actual = object.property;

        expect(actual).toEqual(jasmine.any(Function));
        mock.verify(instance => instance.property);
    });

    it('Returns last written value', () => {
        const value = 'value';
        const newValue = 'new value';

        const object = new Mock<ITestObject>()
            .setup(instance => instance.property)
            .returns(value)
            .object();

        object.property = newValue;
        const actual = object.property;

        expect(actual).toBe(newValue);
    });

    it('Returns the initial value', () => {
        const value = 'value';
        const newValue = 'new value';

        const object = new Mock<ITestObject>()
            .setup(instance => instance.property)
            .returns(value)
            //let's deny any write operation on the property
            .setup(instance => instance.property = It.Is(() => false))
            .returns(true)
            .object();

        try {
            object.property = newValue;
        } catch (e) {
        }
        const actual = object.property;

        expect(actual).toBe(newValue);
    });

    it('Calls callback', () => {
        const value = 'value';
        const callback = jasmine.createSpy('callback').and.returnValue(value);
        const object = new Mock<ITestObject>()
            .setup(instance => instance.property)
            .callback(callback)
            .object();

        const actual = object.property;

        expect(actual).toBe(value);
        expect(callback).toHaveBeenCalled();
    });

    it('Throws an exception', () => {
        const error = new Error('exception');
        const object = new Mock<ITestObject>()
            .setup(instance => instance.property)
            .throws(error)
            .object();

        expect(() => object.property).toThrow(error);
    });

    it('Verifies', () => {

        const mockName = 'mock name';
        const mock = new Mock<ITestObject>(mockName);
        const object = mock.object();

        object.property;

        const action = () => mock.verify(instance => instance.property, Times.AtLeast(2));

        expect(action).toThrow();
    });
});