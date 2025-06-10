package com.example.debkboard.network

import com.example.debkboard.ui.theme.components.DeckButton
import retrofit2.Call
import retrofit2.http.GET

interface DeckApi {
    @GET("deck")
    fun getDeckConfig(): Call<List<DeckButton>>
}
