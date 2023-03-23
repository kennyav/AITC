import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { useFieldArray, useForm } from 'react-hook-form';
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/navigation'
import UserSideMenu from '../../components/UserSideMenu';

export default function CreatePage() {

	const router = useRouter()
	const votingSystems = [
		{
			id: 0,
			slug: `first-past-the-post`,
			type: `plurality`,
			name: `Majority Vote`,
			description: `A majority vote occurs when more than 50% of the individuals involved in the decision-making process agree on a particular option or outcome.`,
		},
		{
			id: 1,
			slug: `ranked-choice`,
			type: `ordinal`,
			name: `Rank-Choice Vote`,
			description: `In a vote by rank system, voters are asked to rank the available options according to their personal preference, by assigning a number to each option, with 1 being their top choice, 2 being their second choice, and so on.`,
		},
	];

	const { control, register, handleSubmit } = useForm({
		defaultValues: {
			title: ``,
			description: ``,
			choices: [{ choice: `` }, { choice: `` }, { choice: `` }],
			votingSystems: votingSystems.map(x => {
				return { ...x, selected: false };
			}),
			options: {
				private: false,
				protected: false,
			},
		},
	});
	const choicesFieldArray = useFieldArray({ control, name: `choices`, keyName: `key` });
	const votingSystemsArray = useFieldArray({ control, name: `votingSystems`, keyName: `key` });

	const onSubmit = (data: any) => {

		const formattedVotingSystems: any[] = [];
		data.votingSystems?.forEach((x: any, i: any) => {
			x.selected === true ? formattedVotingSystems.push({ id: votingSystems[i]?.id, slug: votingSystems[i]?.slug }) : null;
		});
		const formattedChoices = data.choices?.map((x: any, i: any) => {
			return { id: i, ...x };
		});
		const formattedData = { userId: 1, ...data, choices: formattedChoices, votingSystems: formattedVotingSystems };
		console.log("formattedData", formattedData)

		router.push("/")
	};

	const metadata = {
		title: `Create a Poll - AITC Voting`,
		description: `Create two different kinds of polls`,
	};


	return (
		<div>
			<div className='pl-64 pb-72'>
				<main className={`${styles.testFont} container flex justify-center min-h-content bg-brand-primary`}>
					<div className='flex items-center justify-center w-full sm:px-1.5 max-w-7xl'>
						<form
							className='w-full px-4 py-8 my-4 rounded-lg shadow bg-white pl-64 pb-72 sm:px-10'
							onSubmit={handleSubmit(onSubmit)}
							autoComplete='off'
						>
							<div className='flex justify-center'>
								<h1 className='mb-2 text-3xl font-bold text-center text-brand-primary'>Create a Poll</h1>
							</div>
							<label htmlFor='title' className='block text-base font-semibold text-brand-primary'>
								Title
							</label>
							<input
								name='title'
								className='block w-full mt-1 border rounded-md shadow-sm placeholder-brand bg-brand-secondary border-brand text-brand-primary focus-brand-with-border sm:text-sm'
								placeholder='Add a title here...'
								type='text'
								required
								maxLength={100}
							/>
							<div className='flex items-end justify-between mt-4'>
								<label htmlFor='description' className='block text-base font-semibold text-brand-primary'>
									Description
								</label>
								<span className='text-sm italic cursor-default text-brand-secondary'>Optional</span>
							</div>
							<div className='mt-1'>
								<textarea
									name='description'
									className='block w-full mt-1 border rounded-md shadow-sm placeholder-brand border-brand bg-brand-secondary text-brand-primary focus-brand-with-border sm:text-sm'
									placeholder='Add a description here...'
									aria-labelledby='description'
									rows={3}
									maxLength={2000}
								/>
							</div>
							<div className='flex mt-4'>
								<label id='choices' htmlFor='choices' className='inline-flex text-base font-semibold text-brand-primary'>
									Choices
								</label>
							</div>
							{choicesFieldArray.fields.map((item, index) => (
								<div className={`flex ${index ? `mt-3` : `mt-1`}`} key={item.key}>
									<input
										name={`choices[${index}].choice`}
										type='text'
										className='block w-full border rounded-md shadow-sm placeholder-brand bg-brand-secondary border-brand text-brand-primary focus-brand-with-border sm:text-sm'
										placeholder='Add a choice here...'
										required
										aria-labelledby='choices'
										maxLength={500}
									/>
									<button
										className='inline-flex items-center p-2 ml-3 border rounded-md shadow-sm border-brand focus-brand-with-border'
										type='button'
										onClick={() => choicesFieldArray.remove(index)}
									>
										<span className='sr-only'>Delete previous choice</span>
										<MinusIcon className='w-4 text-brand-primary' />
									</button>
								</div>
							))}
							<div className='flex justify-end w-full'>
								<button
									className='inline-flex items-center p-2 mt-3 border rounded-md shadow-sm border-brand focus-brand-with-border'
									type='button'
									onClick={() => choicesFieldArray.append({ choice: `` })}
								>
									<span className='sr-only'>Add another choice</span>
									<PlusIcon className='w-4 text-brand-primary' />
								</button>
							</div>
							<div>
								<p className='block text-base font-semibold text-brand-primary'>Voting Systems</p>
								{votingSystemsArray.fields.map((item, index) => (
									<div key={item.key} className='flex mt-2'>
										<div className='flex items-center h-5'>
											<input
												id={item.slug}
												name={`votingSystems[${index}].selected`}
												type='checkbox'
												className='w-4 h-4 border rounded placeholder-brand bg-brand-secondary border-brand focus-brand-with-border'
											/>
										</div>
										<label htmlFor={item.slug} className='ml-3 text-sm font-medium text-brand-primary'>
											{item.name}
											<p className='font-normal text-brand-secondary'>{item.description}</p>
										</label>
									</div>
								))}
							</div>
							<p className='block mt-3 text-base font-semibold text-brand-primary'>Options</p>
							<div className='flex mt-2'>
								<div className='flex items-center h-5'>
									<input
										id='options.private'
										name='options.private'
										type='checkbox'
										className='w-4 h-4 border rounded placeholder-brand bg-brand-secondary border-brand focus-brand-with-border'
									/>
								</div>
								<label htmlFor='options.private' className='block ml-3 text-sm font-medium text-brand-primary'>
									Private
									<p className='font-normal text-brand-secondary'>Only discoverable via URL</p>
								</label>
							</div>
							<div className='flex mt-2'>
								<div className='flex items-center h-5'>
									<input
										id='options.protected'
										name='options.protected'
										type='checkbox'
										className='w-4 h-4 border rounded placeholder-brand bg-brand-secondary border-brand focus-brand-with-border'
									/>
								</div>
								<label htmlFor='options.protected' className='block ml-3 text-sm font-medium text-brand-primary'>
									Protected
									<p className='font-normal text-brand-secondary'>Only registered users can vote</p>
								</label>
							</div>
							<button
								type='submit'
								className='inline-flex items-center px-4 py-2 mt-4 text-sm font-medium leading-4 border btn-primary hover:bg-gray-100 rounded-lg'
							>
								Submit
							</button>
						</form>
					</div>
				</main>
			</div>
			<UserSideMenu open={true}/>
		</div>
	);
};
