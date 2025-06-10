package com.example.debkboard.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private const val BASE_URL = "http://192.168.18.5:3000/"  // Asegúrate de usar la IP accesible desde el móvil

    val deckApi: DeckApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(DeckApi::class.java)
    }
}
