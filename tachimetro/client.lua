local wasInVehicle = false
local lastSmoke = false

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(200)
        local player = PlayerPedId()
        local inVeh = IsPedInAnyVehicle(player, false)
        local showHUD = false
        local speed = 0
        local engineHealth = 1000 -- valore di default GTA
        local engineOn = false
        local damagePercent = 100
        local vehicle = nil

        if inVeh then
            vehicle = GetVehiclePedIsIn(player, false)
            showHUD = true
            speed = GetEntitySpeed(vehicle) * 3.6
            engineHealth = GetVehicleEngineHealth(vehicle)
            damagePercent = math.floor(((engineHealth-200) / 800) * 100)
            damagePercent = math.max(0, math.min(damagePercent, 100))
            engineOn = GetIsVehicleEngineRunning(vehicle)

            -- FUMO a <30%
            if engineHealth < 440 and not lastSmoke then
                StartVehicleEngineFire(vehicle)
                lastSmoke = true
            elseif engineHealth >= 440 and lastSmoke then
                RemoveVehicleEngineFire(vehicle)
                lastSmoke = false
            end

            -- Spegnimento motore se rotto
            if engineHealth < 200 then
                SetVehicleEngineOn(vehicle, false, true, true)
                SetVehicleUndriveable(vehicle, true)
                SetEntityInvincible(vehicle, true)
            else
                SetEntityInvincible(vehicle, false)
            end
        else
            if wasInVehicle and lastSmoke then
                lastSmoke = false
            end
        end

        -- Manda tutti i dati alla NUI
        SendNUIMessage({
            show = showHUD,
            speed = math.floor(speed),
            engineHealth = engineHealth,
            damagePercent = damagePercent,
            engineOn = engineOn
        })

        wasInVehicle = inVeh
    end
end)
