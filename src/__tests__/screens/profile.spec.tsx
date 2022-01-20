import React from 'react';
import {render} from '@testing-library/react-native'

import { Profile } from '../../screens/Profile'

test('check if show correctly user input name placeholder', () => {
	const { getByPlaceholderText } = render(<Profile />)

	const inputName = getByPlaceholderText('Nome')

	expect(inputName).toBeTruthy()
})

test('cheks if user data has been loaded', () => {
	const { getByTestId } = render(<Profile />)

	const inputName = getByTestId('input-name')
	const inputSurname = getByTestId('input-surname')

	expect(inputName.props.value).toEqual("Marcus")
	expect(inputSurname.props.value).toEqual("Pontes")

})

test('check if title render correctly', () => {
	const { getByTestId } = render(<Profile />)

	const textTitle = getByTestId('text-title');

	expect(textTitle.props.children).toContain('Perfil')
})
