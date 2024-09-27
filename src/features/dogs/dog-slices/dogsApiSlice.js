import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const dogsAdapter = createEntityAdapter({})

const initialState = dogsAdapter.getInitialState()

export const dogsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDogs: builder.query({
      query: ({
        name,
        breed,
        bornEarliest,
        bornLatest,
        country,
        region,
        passport,
        isFixed,
        female,
        heat,
        chipped,
        chipnumber,
        page
      }) => ({
        url: '/dogs',
        params: {
          name,
          breed,
          bornEarliest,
          bornLatest,
          country,
          region,
          passport,
          isFixed,
          female,
          heat,
          chipped,
          chipnumber,
          page
        },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: responseData => {
        const { dogs, totalPages, currentPage } = responseData;

        const loadedDogs = dogs.map(dog => {
          dog.id = dog._id
          return dog
        })

        return {
          dogs: dogsAdapter.setAll(initialState, loadedDogs),
          totalPages,
          currentPage
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Dog', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Dog', id }))
          ]
        } else return [{ type: 'Dog', id: 'LIST' }]
      }
    }),
    getUserDogs: builder.query({
      query: ({ id }) => ({
        url: `/dogs/user/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: responseData => {
        const loadedDogs = responseData.map(dog => {
          dog.id = dog._id
          return dog
        })

        return dogsAdapter.setAll(initialState, loadedDogs)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Dog', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Dog', id }))
          ]
        } else return [{ type: 'Dog', id: 'LIST' }]
      }
    }),
    getProposableFatherDogs: builder.query({
      query: ({ userId, litterId }) => ({
        url: `/dogs/proposable/fathers/${userId}/${litterId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: responseData => {
        const loadedDogs = responseData.map(dog => {
          dog.id = dog._id
          return dog
        })

        return dogsAdapter.setAll(initialState, loadedDogs)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Dog', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Dog', id }))
          ]
        } else return [{ type: 'Dog', id: 'LIST' }]
      }
    }),
    getProposablePuppies: builder.query({
      query: ({ userId, litterId }) => ({
        url: `/dogs/proposable/puppies/${userId}/${litterId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: responseData => {
        const loadedDogs = responseData.map(dog => {
          dog.id = dog._id
          return dog
        })

        return dogsAdapter.setAll(initialState, loadedDogs)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Dog', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Dog', id }))
          ]
        } else return [{ type: 'Dog', id: 'LIST' }]
      }
    }),
    getProposableDogs: builder.query({
      query: ({ userId }) => ({
        url: `/dogs/proposable/dogs/${userId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: responseData => {
        const loadedDogs = responseData.map(dog => {
          dog.id = dog._id
          return dog
        })

        return dogsAdapter.setAll(initialState, loadedDogs)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Dog', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Dog', id }))
          ]
        } else return [{ type: 'Dog', id: 'LIST' }]
      }
    }),
    getLitterPuppies: builder.query({
      query: ({ id }) => ({
        url: `/dogs/litter/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: responseData => {
        const loadedDogs = responseData?.map(dog => {
          dog.id = dog._id
          return dog
        })

        return dogsAdapter.setAll(initialState, loadedDogs)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Dog', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Dog', id }))
          ]
        } else return [{ type: 'Dog', id: 'LIST' }]
      }
    }),
    getDogById: builder.query({
      query: ({ id }) => ({
          url: `/dogs/${id}`,
          validateStatus: (response, result) => {
              return response.status === 200 && !result.isError
          },
      }),
      transformResponse: responseData => {
          return {
              ...responseData,
              id: responseData._id
          }
      },
    }),
    addNewDog: builder.mutation({
      query: initialDog => ({
        url: '/dogs',
        method: 'POST',
        body: {
          ...initialDog,
        }
      }),
      invalidatesTags: [
        { type: 'Dog', id: "LIST" }
      ]
    }),
    updateDog: builder.mutation({
      query: initialDog => ({
        url: '/dogs',
        method: 'PATCH',
        body: {
          ...initialDog,
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Dog', id: arg.id }
      ]
    }),
    deleteDog: builder.mutation({
      query: ({ id }) => ({
        url: '/dogs',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Dog', id: arg.id }
      ]
    }),
  }),
})

export const {
  useGetDogsQuery,
  useGetUserDogsQuery,
  useGetProposableFatherDogsQuery,
  useGetProposablePuppiesQuery,
  useGetProposableDogsQuery,
  useGetLitterPuppiesQuery,
  useGetDogByIdQuery,
  useAddNewDogMutation,
  useUpdateDogMutation,
  useDeleteDogMutation,
} = dogsApiSlice

export const selectDogsResult = dogsApiSlice.endpoints.getDogs.select()

const selectDogsData = createSelector(
  selectDogsResult,
  dogsResult => dogsResult.data
)

export const {
  selectAll: selectAllDogs,
  selectById: selectDogById,
  selectIds: selectDogIds
} = dogsAdapter.getSelectors(state => selectDogsData(state) ?? initialState)
