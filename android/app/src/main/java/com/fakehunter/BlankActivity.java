package com.fakehunter;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class BlankActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent newIntent = new Intent(this, MainActivity.class);
        newIntent.setAction(getIntent().getAction());
        newIntent.putExtras(getIntent().getExtras());
        newIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(newIntent);
        finish();
    }
}
