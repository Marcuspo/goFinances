import React, { useCallback, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { HistoryCard } from '../../components/HistoryCard'
import { VictoryPie } from 'victory-native'
import {useTheme} from 'styled-components'
import { useAuth } from "../../hooks/auth"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { addMonths, subMonths, format } from 'date-fns'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { Container, Header, Title, Content, ChartContainer, MonthSelect, MonthSelectButton, MonthSelectIcon, Month } from './styles'
import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize'
import { ptBR } from 'date-fns/locale'
import { useFocusEffect } from '@react-navigation/native'


interface CategoryData {
	key: string;
	name: string,
	totalFormatted: string,
	total: number,
	color: string,
	percent: string
}
interface TransactionData {

	type: 'positive' | 'negative',
	name: string,
	amount: string,
	category: string,
	date: string,
}

export function Resume() {
	const [isLoading, setIsLoading] = useState(true)
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
	const theme = useTheme()
	const { user } = useAuth()


	function handleDateCHange(action: 'next' | 'prev' ){

		if(action === 'next'){
			setSelectedDate(addMonths(selectedDate, 1))
		}else{
			setSelectedDate(subMonths(selectedDate, 1))
		}
	}

	async function loadData(){
		setIsLoading(true)
		const dataKey =`@gofinance:transactions_user:${user.id}`
		const response = await AsyncStorage.getItem(dataKey);
		const responseFormatted = response ? JSON.parse(response) : [];

		const expensive = responseFormatted.filter((expensive: TransactionData) =>
		expensive.type === 'negative' && new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
		new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
		)

		const expensiveTotal = expensive.reduce((acumullator: number, expensive: TransactionData) => {
			return acumullator + Number(expensive.amount);
		}, 0)

		const totalByCategory: CategoryData[] = []
		categories.forEach(category => {
			let categorySun = 0;

			expensive.forEach((expensive: TransactionData) => {
				if(expensive.category === category.key)
				categorySun += Number(expensive.amount);
			})

			if(categorySun > 0){
				const totalFormatted = categorySun.toLocaleString('pt-BR', {
					style: 'currency',
					currency: 'BRL'
				})

				const percent = `${(categorySun / expensiveTotal * 100).toFixed(0)}%`

			totalByCategory.push({
				key: category.key,
				name: category.name,
				color: category.color,
				total: categorySun,
				totalFormatted,
				percent
			})}
		})

		setTotalByCategories(totalByCategory);
		setIsLoading(false)
	}

	useFocusEffect(useCallback(() => {
		loadData()
	},[selectedDate]))

	return (
		<Container>
			{ isLoading ? <ActivityIndicator size='large'  style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} /> :

				<>
					<Header>
				<Title>Resumo por categoria</Title>
			</Header>

			<Content
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: useBottomTabBarHeight(),
					paddingHorizontal: 24
				}}
			>
				<MonthSelect>
					<MonthSelectButton onPress={() => handleDateCHange('prev')}>
						<MonthSelectIcon name='chevron-left' />
					</MonthSelectButton>

					<Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

					<MonthSelectButton onPress={() => handleDateCHange('next')} >
						<MonthSelectIcon name='chevron-right' />
					</MonthSelectButton>
				</MonthSelect>

				<ChartContainer>
				<VictoryPie
					data={totalByCategories}
					x={(datum) => datum.percent}
					y={(datum) => datum.total}
					style={{
						labels: { fontSize: RFValue(18),
									fontWeight: 'bold',
									fill: theme.colors.shape
							}
					}}
					labelRadius={50}
					colorScale={totalByCategories.map(category => category.color)}
				/>
				</ChartContainer>

				{totalByCategories.map(item => (
					<HistoryCard title={item.name} amount={item.totalFormatted} color={item.color} key={item.key} />
				))}
			</Content>
				</>

			}

		</Container>
	)
}
