import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.checks import messages
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.urls import reverse
from deep_translator import GoogleTranslator
from django.views.decorators.csrf import csrf_exempt
import time


def index(request):
    return render(request, 'index.html')


@csrf_exempt
def translate(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data["source_lang"] == 'zh': data["source_lang"] = "zh-cn"
        if data["dest_lang"] == 'zh': data["dest_lang"] = "zh-cn"

        if data["source_lang"] == 'po': data["source_lang"] = "portuguese"
        if data["dest_lang"] == 'po': data["dest_lang"] = "portuguese"

        if data["source_lang"] == 'ge': data["source_lang"] = "de"
        if data["dest_lang"] == 'ge': data["dest_lang"] = "de"

        try:
            result = GoogleTranslator(source=data["source_lang"], target=data["dest_lang"]).translate(data["content"])
        except Exception as e:
            result = e.message
        return JsonResponse(data={"result": result}, safe=False)


@csrf_exempt
def translate_batch(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data["source_lang"] == 'zh': data["source_lang"] = "zh-cn"
        if data["dest_lang"] == 'zh': data["dest_lang"] = "zh-cn"

        if data["source_lang"] == 'po': data["source_lang"] = "portuguese"
        if data["dest_lang"] == 'po': data["dest_lang"] = "portuguese"

        if data["source_lang"] == 'ge': data["source_lang"] = "de"
        if data["dest_lang"] == 'ge': data["dest_lang"] = "de"

        try:
            #result = GoogleTranslator(source=data["source_lang"], target=data["dest_lang"]).translate_batch(batch=data["content"].replace('\n', ',').split(',')[:-1])
            #result = GoogleTranslator(source=data["source_lang"], target=data["dest_lang"]).translate_batch(batch=data["content"].split(','))
            result = batch(source_lang=data["source_lang"], dest_lang=data["dest_lang"], batch=data["content"].split(','))
        except Exception as e:
            result = e.message
        return JsonResponse(data={"result": result}, safe=False)



def batch(source_lang, dest_lang, batch=None):
    if not batch:
        raise Exception("Enter your text list that you want to translate")

    res = ''
    for text in batch:
        translated = GoogleTranslator(source=source_lang, target=dest_lang).translate(text=text)
        res += translated + ","
        time.sleep(0.5)
    return res[:-1]
@csrf_exempt
def translate_word(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data["source_lang"] == 'zh': data["source_lang"] = "zh-cn"
        if data["dest_lang"] == 'zh': data["dest_lang"] = "zh-cn"

        if data["source_lang"] == 'po': data["source_lang"] = "portuguese"
        if data["dest_lang"] == 'po': data["dest_lang"] = "portuguese"

        if data["source_lang"] == 'ge': data["source_lang"] = "de"
        if data["dest_lang"] == 'ge': data["dest_lang"] = "de"

        raw_data = data["content"].replace('\n', '\n ')
        raw_data = data["content"].replace(',', ', ')
        raw_data = raw_data.split(' ')

        try:
            for count, item in enumerate(raw_data):
                word_to_translated = raw_data[count]
                if word_to_translated != ',' and word_to_translated != '' and word_to_translated != ' ' and word_to_translated != '\n' and word_to_translated != '\n ':
                    translated_word = GoogleTranslator(source=data["source_lang"], target=data["dest_lang"]).translate(
                        raw_data[count])
                    raw_data[count] = translated_word
        except Exception as e:
            return JsonResponse(data={"result": e, 'error': "1"}, safe=False)
        return JsonResponse(data={"result": ' '.join([str(elem) for elem in raw_data])}, safe=False)


# @login_required
def multiples(request):
    return render(request, 'multiples.html')


def line_translate(request):
    return render(request, 'line_translate.html')


@login_required
def user_signup(request):
    if request.user.is_authenticated:
        return render(request, 'home.html')
    if request.method == 'POST':
        username = request.POST.get('username')
        useremail = request.POST.get('useremail')
        password = request.POST.get('password')
        if username_exists(username) == False and usermail_exists(useremail) == False:
            user = User.objects.create_user(username, useremail, password)
            login(request, user)
            return redirect("index")
        else:
            messages.error(request, 'User Name or email already exist.')
            return render(request, 'signup.html')
    else:
        return render(request, 'signup.html')


def user_login(request):
    if request.user.is_authenticated:
        return render(request, 'home.html')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(reverse('index'))
            else:
                messages.error(request, 'Your account was inactive.')
                return render(request, 'login.html')
        else:
            messages.error(request, 'Invalid login details given.')
            return render(request, 'login.html')
    else:
        return render(request, 'login.html')


'''Called when user logs out'''


def user_logout(request):
    logout(request)
    messages.success(request, 'User signed out successfully')
    return render(request, 'login.html')


def username_exists(username):
    if User.objects.filter(username=username).exists():
        return True
    return False


def usermail_exists(useremail):
    if User.objects.filter(email=useremail).exists():
        return True
    return False
